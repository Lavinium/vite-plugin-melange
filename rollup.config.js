import fs from 'fs'
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));

const pkg = loadJSON('./package.json');
// console.log({pkg: pkg.exports.import})
export default {
  input: pkg.main,
  external: Object.keys(pkg.dependencies).concat(['fs', 'path', 'child_process']),
  output: [
    { format: 'cjs', file: pkg.exports.require, exports: 'auto' },
    { format: 'esm', file: pkg.exports.import }
  ]
};
