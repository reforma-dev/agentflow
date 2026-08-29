import { expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  AGENTFLOW_SKILLS,
  AGENTS_SNIPPET,
  GENERATED_MARKER,
  runCli,
} from '../src/cli';

function project() {
  const cwd = mkdtempSync(join(tmpdir(), 'agentflow-'));
  let stdout = '';
  let stderr = '';
  const calls: string[][] = [];

  return {
    cwd,
    calls,
    stdout: { write: (value: string) => (stdout += value) },
    stderr: { write: (value: string) => (stderr += value) },
    output: () => ({ stdout, stderr }),
    cleanup: () => rmSync(cwd, { recursive: true, force: true }),
  };
}

test('init installs every skill and writes the workflow', () => {
  const context = project();

  try {
    const status = runCli(['init'], {
      ...context,
      workflow: '# Workflow\n',
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      ['add', 'reforma-dev/agentflow', '--skill', '*'],
    ]);
    expect(readFileSync(join(context.cwd, 'AGENTFLOW.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Workflow\n`,
    );
    expect(readFileSync(join(context.cwd, '.gitignore'), 'utf8')).toBe(
      '.agentflow/\n',
    );
    expect(context.output().stdout).toContain('AgentFlow initialized');
    expect(context.output().stdout).toContain(AGENTS_SNIPPET);
    expect(context.output().stderr).toBe('');
  } finally {
    context.cleanup();
  }
});

test('init is idempotent and forwards install options', () => {
  const context = project();
  writeFileSync(join(context.cwd, '.gitignore'), 'dist/\n.agentflow/\n');
  writeFileSync(
    join(context.cwd, 'AGENTFLOW.md'),
    `${GENERATED_MARKER}\n\nold\n`,
  );

  try {
    const status = runCli(
      ['init', '--agent', 'cursor', '--global', '--yes'],
      {
        ...context,
        workflow: 'new\n',
        runSkills: (args) => {
          context.calls.push(args);
          return 0;
        },
      },
    );

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      [
        'add',
        'reforma-dev/agentflow',
        '--skill',
        '*',
        '--agent',
        'cursor',
        '--global',
        '--yes',
      ],
    ]);
    expect(readFileSync(join(context.cwd, '.gitignore'), 'utf8')).toBe(
      'dist/\n.agentflow/\n',
    );
    expect(readFileSync(join(context.cwd, 'AGENTFLOW.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\nnew\n`,
    );
  } finally {
    context.cleanup();
  }
});

test('init protects a user-owned AGENTFLOW.md', () => {
  const context = project();
  writeFileSync(join(context.cwd, 'AGENTFLOW.md'), '# My workflow\n');

  try {
    const status = runCli(['init'], {
      ...context,
      workflow: '# AgentFlow\n',
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(1);
    expect(context.calls).toEqual([]);
    expect(readFileSync(join(context.cwd, 'AGENTFLOW.md'), 'utf8')).toBe(
      '# My workflow\n',
    );
    expect(context.output().stderr).toContain('not managed by AgentFlow CLI');
  } finally {
    context.cleanup();
  }
});

test('update refreshes only AgentFlow skills and generated workflow', () => {
  const context = project();
  writeFileSync(
    join(context.cwd, 'AGENTFLOW.md'),
    `${GENERATED_MARKER}\n\nold\n`,
  );

  try {
    const status = runCli(['update', '--project', '--yes'], {
      ...context,
      workflow: '# Current workflow\n',
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      ['update', ...AGENTFLOW_SKILLS, '--project', '--yes'],
    ]);
    expect(readFileSync(join(context.cwd, 'AGENTFLOW.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Current workflow\n`,
    );
    expect(context.output().stdout).toBe('AgentFlow updated.\n');
  } finally {
    context.cleanup();
  }
});

test('a delegated failure leaves project files untouched', () => {
  const context = project();

  try {
    const status = runCli(['init'], {
      ...context,
      workflow: '# Workflow\n',
      runSkills: () => 9,
    });

    expect(status).toBe(9);
    expect(() =>
      readFileSync(join(context.cwd, 'AGENTFLOW.md'), 'utf8'),
    ).toThrow();
    expect(() =>
      readFileSync(join(context.cwd, '.gitignore'), 'utf8'),
    ).toThrow();
    expect(context.output().stderr).toContain('exit code 9');
  } finally {
    context.cleanup();
  }
});
