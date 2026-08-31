import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

export const AGENTFLOW_SKILLS = [
  'research',
  'grill',
  'plan',
  'code-review',
  'handoff',
  'tdd',
  'document',
];
export const SKILLS_SOURCE = 'reforma-dev/agentflow';

interface SkillsPackage {
  bin: string | Record<string, string>;
}

export type RunSkills = (args: string[]) => number;

export const runSkills: RunSkills = (args) => {
  const require = createRequire(import.meta.url);
  const packagePath = require.resolve('skills/package.json');
  const packageJson = JSON.parse(
    readFileSync(packagePath, 'utf8'),
  ) as SkillsPackage;
  const relativeBin =
    typeof packageJson.bin === 'string'
      ? packageJson.bin
      : packageJson.bin.skills;

  if (!relativeBin) {
    throw new Error('The installed skills package does not expose a skills bin.');
  }

  const result = spawnSync(
    process.execPath,
    [resolve(dirname(packagePath), relativeBin), ...args],
    { stdio: 'inherit' },
  );

  if (result.error) {
    throw result.error;
  }

  return result.status ?? 1;
};
