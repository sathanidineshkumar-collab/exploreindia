const { spawn } = require('child_process');

console.log('====================================================');
console.log('  ExploreIndia Full-Stack Development Environment   ');
console.log('====================================================');
console.log('  \x1b[32m✔ Frontend Web App:\x1b[0m  http://localhost:3000 (Open in Browser)');
console.log('  \x1b[36m✔ Backend REST API:\x1b[0m  http://localhost:5000/api');
console.log('====================================================\n');

const isWin = process.platform === 'win32';

function runProcess(cmd, args, prefix, colorCode) {
  const child = spawn(isWin ? `${cmd}.cmd` : cmd, args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: isWin,
    env: process.env
  });

  child.stdout.on('data', (chunk) => {
    const lines = chunk.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
      }
    });
  });

  child.stderr.on('data', (chunk) => {
    const lines = chunk.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`\x1b[${colorCode}m[${prefix} ERR]\x1b[0m ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`[${prefix}] exited with code ${code}`);
  });

  return child;
}

// 1. Start Backend on port 5000
const backend = runProcess('npm', ['--prefix', 'backend', 'run', 'dev'], 'BACKEND', '36'); // Cyan

// 2. Start Frontend on port 3000
const frontend = runProcess('npm', ['--prefix', 'frontend', 'run', 'dev'], 'FRONTEND', '32'); // Green

function handleExit() {
  console.log('\nGracefully terminating ExploreIndia servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
