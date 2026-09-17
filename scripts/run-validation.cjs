const { existsSync, mkdirSync, rmSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { spawnSync } = require('node:child_process');

const validations = Object.freeze({
  data: 'validate-data',
  home: 'validate-home',
  filters: 'validate-filters',
  storage: 'validate-storage',
  illustrations: 'validate-illustrations',
  detail: 'validate-event-detail',
  theme: 'validate-theme',
});

const requested = process.argv[2] ?? 'all';
const selected = requested === 'all'
  ? Object.values(validations)
  : validations[requested]
    ? [validations[requested]]
    : null;

if (!selected) {
  console.error(`Validación desconocida: ${requested}. Usa all, ${Object.keys(validations).join(', ')}.`);
  process.exit(2);
}

const projectRoot = resolve(__dirname, '..');
const temporaryName = `.tmp-paso9-validation-${process.pid}`;
const temporaryDirectory = join(projectRoot, temporaryName);

class CommandFailure extends Error {
  constructor(status) {
    super(`La validación terminó con código ${status}.`);
    this.status = status;
  }
}

if (existsSync(temporaryDirectory)) {
  console.error(`La carpeta temporal ya existe: ${temporaryName}`);
  process.exit(2);
}

const run = (executable, args) => {
  const result = spawnSync(executable, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) throw new CommandFailure(result.status ?? 1);
};

try {
  mkdirSync(temporaryDirectory);
  run(process.execPath, [
    join(projectRoot, 'node_modules', 'typescript', 'bin', 'tsc'),
    '--ignoreConfig',
    '--module', 'node16',
    '--moduleResolution', 'node16',
    '--target', 'es2022',
    '--esModuleInterop',
    '--resolveJsonModule',
    '--strict',
    '--skipLibCheck',
    '--rootDir', '.',
    '--outDir', temporaryName,
    ...selected.map(name => `scripts/${name}.ts`),
  ]);

  for (const name of selected) {
    run(process.execPath, [join(temporaryDirectory, 'scripts', `${name}.js`)]);
  }
} catch (error) {
  if (error instanceof CommandFailure) {
    process.exitCode = error.status;
  } else {
    console.error(error);
    process.exitCode = 1;
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
