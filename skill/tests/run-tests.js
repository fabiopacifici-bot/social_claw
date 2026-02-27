const { spawn } = require('child_process')
const p = spawn('node', ['test-providers.js'], { cwd: __dirname, stdio: 'inherit' })

p.on('close', code => process.exit(code))
