/**
 * @typedef { typeof import("../../packages/nodebox").Nodebox } Nodebox
 * @type {Nodebox} */
const Nodebox = window.Nodebox;

/**
 * @param {string} emulatorUrl
 */
window.runExample = async function (emulatorUrl) {
  const emulator = new Nodebox({
    runtimeUrl: emulatorUrl,
    iframe: document.getElementById('frame'),
  });

  await emulator.connect();

  await emulator.fs.init({
    'package.json': JSON.stringify({
      dependencies: {
        express: '4.18.2',
      },
    }),
    'index.js': `const fs = require("fs");
const path = require("path");

fs.mkdirSync("src");
fs.mkdirSync("src/something");
fs.mkdirSync("out");
fs.symlinkSync(path.join(__dirname, "src/something"), "out/src", "dir");
fs.writeFileSync("out/src/info.txt", "hello world", "utf-8");
fs.mkdirSync("out/src/sub-dir");
fs.writeFileSync("out/src/sub-dir/blabla.txt", "blabla", "utf-8");
console.log(fs.readFileSync("out/src/info.txt", "utf-8"));
console.log(fs.readFileSync("out/src/sub-dir/blabla.txt", "utf-8"));
console.log(fs.readdirSync("out/src"));
console.log(fs.readdirSync("out/src/sub-dir"));
`,
  });

  const shellProcess = emulator.shell.create();
  return await shellProcess.runCommand('node', ['index.js']);
};
