import { spawn } from 'node:child_process'
import { execSync } from 'node:child_process'

const PORTS = [15173, 15501, 15504, 15505]
const HOSTING_URL = 'http://127.0.0.1:15504'

function killPort(port) {
  try {
    const pids = execSync(`lsof -ti tcp:${port}`, { stdio: ['pipe', 'pipe', 'ignore'] })
      .toString()
      .trim()
    if (pids) {
      for (const pid of pids.split('\n')) {
        try {
          process.kill(Number(pid), 'SIGKILL')
        } catch {
          // process already gone
        }
      }
      console.log(`[dev] killed process on port ${port}`)
    }
  } catch {
    // nothing listening on this port
  }
}

function openBrowser(url) {
  const platform = process.platform
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open'
  spawn(cmd, platform === 'win32' ? ['', url] : [url], { shell: platform === 'win32', stdio: 'ignore', detached: true }).unref()
}

console.log('[dev] freeing dev ports:', PORTS.join(', '))
for (const port of PORTS) killPort(port)

const env = { ...process.env, VITE_USE_EMULATORS: 'true' }

const emulators = spawn('firebase', ['emulators:start', '--only', 'functions,hosting'], {
  stdio: 'inherit',
  env,
})

const vite = spawn('npx', ['vite'], { stdio: 'inherit', env })

const tryOpen = setInterval(() => {
  try {
    execSync(`lsof -ti tcp:15504`, { stdio: ['pipe', 'pipe', 'ignore'] })
    clearInterval(tryOpen)
    console.log(`[dev] opening ${HOSTING_URL}`)
    openBrowser(HOSTING_URL)
  } catch {
    // hosting emulator not up yet
  }
}, 1000)

function shutdown() {
  clearInterval(tryOpen)
  emulators.kill('SIGINT')
  vite.kill('SIGINT')
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
emulators.on('exit', shutdown)
vite.on('exit', shutdown)
