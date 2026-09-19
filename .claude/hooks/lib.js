// Shared helper for hook scripts that read a JSON payload from stdin.
function readHookInput(callback) {
  let input = '';
  process.stdin.on('data', (chunk) => {
    input += chunk;
  });
  process.stdin.on('end', () => {
    let payload;
    try {
      payload = JSON.parse(input);
    } catch {
      process.exit(0);
    }
    if (typeof payload !== 'object' || payload === null) {
      process.exit(0);
    }
    callback(payload);
  });
}

module.exports = { readHookInput };
