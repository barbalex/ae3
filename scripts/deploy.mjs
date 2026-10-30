// deploys production by updating the artdaten and ae branches from main:
// commits the version bump (scripts/bumpVersion.mjs) on main and pushes main,
// then fast-forwards the deploy branches to main. pushing artdaten deploys
// artdaten.ch, pushing ae deploys arteigenschaften.ch (both on Vercel).
// the working tree and uncommitted changes to other files are left alone.
// usage: npm run deploy [patch|minor|major] [ae|artdaten]
//   both arguments optional: bump type defaults to patch, branch to both
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const allDeployBranches = ['artdaten', 'ae']
const domains = { artdaten: 'artdaten.ch', ae: 'arteigenschaften.ch' }

const run = (cmd, args) => {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  return execFileSync(cmd, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim()
}

const args = process.argv.slice(2)
const unknownArgs = args.filter(
  (arg) =>
    !['patch', 'minor', 'major'].includes(arg) && !allDeployBranches.includes(arg),
)
if (unknownArgs.length > 0) {
  console.error(
    `unknown argument(s) ${unknownArgs.join(', ')} — use patch, minor, major, ae or artdaten`,
  )
  process.exit(1)
}
const type = args.find((arg) => ['patch', 'minor', 'major'].includes(arg)) ?? 'patch'
const deployBranches = [
  ...new Set(args.filter((arg) => allDeployBranches.includes(arg))),
]
const branches =
  deployBranches.length > 0 ? deployBranches : [...allDeployBranches]

const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
if (branch !== 'main') {
  console.error(`deploy must be run on main, not on ${branch}`)
  process.exit(1)
}

// bump the version and date in package.json
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
console.log(run('node', [path.join(root, 'scripts/bumpVersion.mjs'), type]))

// commit the version bump
run('git', ['add', 'package.json'])
if (run('git', ['diff', '--cached', '--name-only'])) {
  run('git', ['commit', '-m', 'up version'])
  console.log(`committed: ${run('git', ['log', '-1', '--format=%h %s'])}`)
} else {
  console.log('no version change to commit')
}

run('git', ['push', 'origin', 'main'])

// fast-forward the deploy branches to main
for (const deployBranch of branches) {
  try {
    run('git', ['push', 'origin', `main:${deployBranch}`])
  } catch {
    console.error(
      `pushing ${deployBranch} failed — see the git error above; if it diverged from main, resolve manually with:\n` +
        `  git checkout ${deployBranch} && git merge main`,
    )
    process.exit(1)
  }
}
console.log(
  `${branches.map((branch) => `${domains[branch]} (branch ${branch})`).join(' and ')} deploy${branches.length > 1 ? 's' : ''} triggered`,
)
