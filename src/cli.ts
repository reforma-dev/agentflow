import { cancel, isCancel, multiselect } from '@clack/prompts';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AGENTS_POINTER,
  ensureAgentsPointer,
  generatedWorkflow,
  isGeneratedWorkflow,
  readSetupConfig,
  SETUP_COMPONENTS,
  type SetupComponent,
  writeAtomically,
  writeSetupConfig,
} from './project';
import {
  AGENTFLOW_SKILLS,
  type RunSkills,
  runSkills,
  SKILLS_SOURCE,
} from './skills';

export {
  AGENTS_POINTER,
  GENERATED_MARKER,
  type SetupComponent,
} from './project';
export { AGENTFLOW_SKILLS } from './skills';

interface Writer {
  write(value: string): unknown;
}

interface CliDependencies {
  cwd?: string;
  stdout?: Writer;
  stderr?: Writer;
  promptSetup?: () => Promise<SetupComponent[] | null>;
  runSkills?: RunSkills;
  workflow?: string;
}

interface PackageJson {
  version: string;
}

type Command = 'init' | 'update';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
) as PackageJson;

function parseOptions(args: string[], command: Command): string[] {
  const forwarded: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--agent' || argument === '-a') {
      if (command !== 'init') {
        throw new Error(`${argument} is only supported by init.`);
      }

      const agent = args[index + 1];
      if (!agent || agent.startsWith('-')) {
        throw new Error(`${argument} requires an agent name.`);
      }

      forwarded.push(argument, agent);
      index += 1;
      continue;
    }

    if (argument === '--global' || argument === '-g') {
      forwarded.push(argument);
      continue;
    }

    if (argument === '--project' || argument === '-p') {
      if (command !== 'update') {
        throw new Error(`${argument} is only supported by update.`);
      }

      forwarded.push(argument);
      continue;
    }

    if (argument === '--yes' || argument === '-y') {
      forwarded.push(argument);
      continue;
    }

    throw new Error(`Unknown option: ${argument}`);
  }

  return forwarded;
}

function help(): string {
  return `AgentFlow ${packageJson.version}

Usage:
  agentflow init [--agent <name>] [--global] [--yes]
  agentflow update [--global | --project] [--yes]
  agentflow --version

Commands:
  init      Choose and install AgentFlow components
  update    Update AgentFlow, installing it first when needed

The skills CLI handles skill, agent, scope, and installation choices.
`;
}

async function promptSetup(): Promise<SetupComponent[] | null> {
  const selected = await multiselect<SetupComponent>({
    message: 'What do you want to install?',
    options: [
      { value: 'skills', label: 'AgentFlow skills' },
      { value: 'workflow', label: 'AGENTFLOW.md' },
      { value: 'agents', label: 'AGENTS.md pointer' },
    ],
    initialValues: [...SETUP_COMPONENTS],
    required: true,
  });

  if (isCancel(selected)) {
    cancel('AgentFlow setup cancelled.');
    return null;
  }

  return selected;
}

export async function runCli(
  args: string[],
  {
    cwd = process.cwd(),
    stdout = process.stdout,
    stderr = process.stderr,
    promptSetup: selectSetup = promptSetup,
    runSkills: executeSkills = runSkills,
    workflow = readFileSync(resolve(packageRoot, 'AGENTFLOW.md'), 'utf8'),
  }: CliDependencies = {},
): Promise<number> {
  const [command, ...optionArgs] = args;

  if (!command || command === '--help' || command === '-h') {
    stdout.write(help());
    return 0;
  }

  if (command === '--version' || command === '-v') {
    stdout.write(`${packageJson.version}\n`);
    return 0;
  }

  if (command !== 'init' && command !== 'update') {
    stderr.write(`Unknown command: ${command}\n\n${help()}`);
    return 1;
  }

  try {
    const forwarded = parseOptions(optionArgs, command);
    const workflowPath = resolve(cwd, 'AGENTFLOW.md');
    const config = readSetupConfig(cwd);
    const legacyInstall = !config && isGeneratedWorkflow(workflowPath);
    const installing = command === 'init' || (!config && !legacyInstall);
    const assumeDefaults =
      forwarded.includes('--yes') || forwarded.includes('-y');
    const components = installing
      ? assumeDefaults
        ? [...SETUP_COMPONENTS]
        : await selectSetup()
      : (config?.components ?? ['skills', 'workflow']);

    if (!components) {
      return 0;
    }

    if (
      components.includes('workflow') &&
      existsSync(workflowPath) &&
      !isGeneratedWorkflow(workflowPath)
    ) {
      throw new Error(
        'AGENTFLOW.md is not managed by AgentFlow CLI. Move it or merge it manually before continuing.',
      );
    }

    if (components.includes('skills')) {
      const installOptions = forwarded.filter(
        (option) => option !== '--project' && option !== '-p',
      );
      const skillsArgs = installing
        ? [
            'add',
            SKILLS_SOURCE,
            ...(assumeDefaults ? ['--skill', '*'] : []),
            ...installOptions,
          ]
        : ['update', ...AGENTFLOW_SKILLS, ...forwarded];
      const status = executeSkills(skillsArgs);

      if (status !== 0) {
        const operation = installing ? 'install' : 'update';
        stderr.write(
          `Agent skills ${operation} failed with exit code ${status}.\n`,
        );
        return status;
      }
    }

    if (components.includes('workflow')) {
      writeAtomically(workflowPath, generatedWorkflow(workflow));
    }

    if (components.includes('agents')) {
      ensureAgentsPointer(cwd);
    }

    writeSetupConfig(cwd, components);

    if (installing) {
      stdout.write('AgentFlow initialized.\n');
    } else {
      stdout.write('AgentFlow updated.\n');
    }

    return 0;
  } catch (error) {
    stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    return 1;
  }
}
