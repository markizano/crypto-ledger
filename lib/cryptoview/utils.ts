
import { log } from 'cryptoview/logger';
const __name__ = 'cryptoview.utils';

export function getEnv(name: string, defaltam: string = ''): string {
  if ( process.env.hasOwnProperty(name) ) {
    return process.env[name] || '';
  } else {
    return defaltam || '';
  }
}

export function debugPass(value: any): void {
  log.verbose(__name__, '[ \x1b[32mPass\x1b[0m ]: ' + JSON.stringify( value, null, 2 ) );
}
  
export function debugFail(e: Error): void {
  log.error(__name__, '[ \x1b[1;31mException\x1b[0m ]: ' + e );
}
