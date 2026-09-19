#!/usr/bin/env node
// PreToolUse hook (matcher: Bash). Censura secretos en el comando antes de
// ejecutarlo, en vez de bloquear la llamada entera.

const { readHookInput } = require('./lib');

const SECRET_PATTERNS = [
  /sk_live_[A-Za-z0-9]{10,}/g,
  /sk_test_[A-Za-z0-9]{10,}/g,
  /sk-ant-[A-Za-z0-9_-]{20,}/g,
  /sk-proj-[A-Za-z0-9_-]{20,}/g,
  /AKIA[0-9A-Z]{16}/g,
  /ghp_[A-Za-z0-9]{30,}/g,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, // JWT
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g, // PEM block
];

readHookInput((payload) => {
  const command = payload.tool_input && payload.tool_input.command;
  if (typeof command !== 'string') {
    process.exit(0);
  }

  let redacted = command;
  for (const pattern of SECRET_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]');
  }

  if (redacted === command) {
    process.exit(0);
  }

  const updatedInput = { ...payload.tool_input, command: redacted };
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
        permissionDecisionReason: 'Secreto detectado y censurado antes de ejecutar el comando.',
        updatedInput,
      },
    })
  );
  process.exit(0);
});
