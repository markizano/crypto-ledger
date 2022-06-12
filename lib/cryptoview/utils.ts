
const load = require('js-yaml').load;
const readFile = require('fs/promises').readFile;

export function debugPass(value: void) {
  console.log('[ \x1b[32mPass\x1b[0m ]: ' + value );
}
  
export function debugFail(e: Error) {
  console.log('[ \x1b[1;31mException\x1b[0m ]: ' + e );
}

export async function loadConfig(filename: string) {
    return load(await readFile(filename, "utf8") );
}

module.exports = { debugPass, debugFail, loadConfig };
