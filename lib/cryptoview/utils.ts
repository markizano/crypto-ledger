
import { load } from 'js-yaml';
import { readFile } from 'fs/promises';

function debugPass(res: Object, err: Error) {
  if ( err ) {
    console.log('[ \x1b[31mError\x1b[0m ]: ' + err);
  }
  console.log('[ \x1b[32mPass\x1b[0m ]: ' + res );
}
  
function debugFail(e: Error) {
  console.log('[ \x1b[1;31mException\x1b[0m ]: ' + e );
}

async function loadConfig(filename: string) {
    return load(await readFile(filename, "utf8") );
}

module.exports = { debugPass, debugFail, loadConfig };
