import { build } from 'esbuild';

await build({
  entryPoints: ['src/firebase.js'],
  outfile: 'dist/firebase.js',
  bundle: true,
  minify: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  legalComments: 'inline',
  sourcemap: false
});
console.log('Built the bundled Healthopedia Firebase client.');
