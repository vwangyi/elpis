import packageJson from '../package.json' with { type: 'json' };

export function version(program) {
  program.version(packageJson.version, '-v, --version');
}
