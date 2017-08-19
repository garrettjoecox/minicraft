
import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'src/Minicraft.ts',
  format: 'iife',
  moduleName: '_minicraft',
  dest: 'index.js',
  plugins: [ typescript() ],
};
