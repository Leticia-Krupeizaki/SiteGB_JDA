// Empacota os scripts de operação em JS puro para a imagem Docker (sem tsx nem código-fonte).
// ESM porque o cliente gerado do Prisma usa import.meta.url; o banner recria `require`
// para as dependências CommonJS (pg).
import { build } from 'esbuild';

await build({
  entryPoints: ['scripts/admin.ts', 'scripts/storage-init.ts'],
  outdir: 'dist-scripts',
  outExtension: { '.js': '.mjs' },
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  external: ['pg-native'],
  banner: { js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);" },
  logLevel: 'info',
});
