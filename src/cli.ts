import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AGENTS_SNIPPET,
  ensureIgnored,
  generatedWorkflow,
  isGeneratedWorkflow,
  writeAtomically,
} from './project';
import {
  AGENTFLOW_SKILLS,
  type RunSkills,
  runSkills,
  SKILLS_SOURCE,
} from './skills';

export { AGENTS_SNIPPET, GENERATED_MARKER } from './project';
export { AGENTFLOW_SKILLS } from './skills';

interface Writer {
  write(value: string): unknown;
}

interface CliDependencies {
  cwd?: string;
  stdout?: Writer;
  stderr?: Writer;
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
  init      Install all AgentFlow skills and write AGENTFLOW.md
  update    Update installed AgentFlow skills and refresh AGENTFLOW.md

AgentFlow prints the AGENTS.md snippet for you to add manually.
`;
}

export function runCli(
  args: string[],
  {
    cwd = process.cwd(),
    stdout = process.stdout,
    stderr = process.stderr,
    runSkills: executeSkills = runSkills,
    workflow = readFileSync(resolve(packageRoot, 'README.md'), 'utf8'),
  }: CliDependencies = {},
): number {
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

    if (existsSync(workflowPath) && !isGeneratedWorkflow(workflowPath)) {
      throw new Error(
        'AGENTFLOW.md is not managed by AgentFlow CLI. Move it or merge it manually before continuing.',
      );
    }

    if (command === 'update' && !existsSync(workflowPath)) {
      throw new Error('AgentFlow is not initialized here. Run `agentflow init`.');
    }

    const skillsArgs =
      command === 'init'
        ? ['add', SKILLS_SOURCE, '--skill', '*', ...forwarded]
        : ['update', ...AGENTFLOW_SKILLS, ...forwarded];
    const status = executeSkills(skillsArgs);

    if (status !== 0) {
      stderr.write(`Agent skills ${command} failed with exit code ${status}.\n`);
      return status;
    }

    writeAtomically(workflowPath, generatedWorkflow(workflow));
    ensureIgnored(cwd);

    if (command === 'init') {
      stdout.write(
        `AgentFlow initialized.\n\nAdd this line to AGENTS.md:\n\n${AGENTS_SNIPPET}\n`,
      );
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
