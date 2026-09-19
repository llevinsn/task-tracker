#!/usr/bin/env node
// PostToolUse hook (matcher: Write|Edit). Checks JS syntax right after an
// edit and fails the turn (exit 2) if the file doesn't parse, so Claude sees
// the error immediately instead of finding out at the Stop hook / test run.

const fs = require('fs');
const { execFileSync } = require('child_process');
const { readHookInput } = require('./lib');

readHookInput((payload) => {
  const filePath =
    (payload.tool_input && payload.tool_input.file_path) ||
    (payload.tool_response && payload.tool_response.filePath);

  if (typeof filePath !== 'string' || !filePath.endsWith('.js')) {
    process.exit(0);
  }

  if (!fs.existsSync(filePath)) {
    process.exit(0);
  }

  try {
    execFileSync('node', ['--check', filePath], { stdio: 'pipe' });
    process.exit(0);
  } catch (err) {
    if (!err.stderr || err.stderr.length === 0) {
      // Not an actual syntax error (e.g. node missing from PATH, spawn
      // failure) — fail open instead of misreporting it as broken syntax.
      process.exit(0);
    }
    process.stderr.write(`Syntax error in ${filePath}:\n${err.stderr}`);
    process.exit(2);
  }
});
