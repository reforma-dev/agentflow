#!/usr/bin/env node

import { runCli } from './cli';

process.exitCode = runCli(process.argv.slice(2));
