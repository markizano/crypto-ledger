
import { log } from 'cryptoview/logger';
import { request, ClientRequest } from 'node:http';
const __name__ = 'cryptoview.blockchains.btc';


//curl --user myusername --data-binary \
//'{"jsonrpc": "1.0", "id": "curltest", "method": "listreceivedbyaddress", "params": [6, true, true, "bc1q09vm5lfy0j5reeulh4x5752q25uqqvz34hufdl"]}' -H 'content-type: text/plain;' http://127.0.0.1:8332/

/**
 * Generate the RPC Request body as JSON encoded string to send to the server.
 * @param method {string} The method to call against the bitcoind daemon.
 * @param params {string[]} The arguments to the function call.
 * @returns 
 */
const generateRpcRequest = (method: string, params: string[]): string => {
    return JSON.stringify({
        jsonrpc: '1.0',
        id: 'CryptoView',
        method: method,
        params: params
    });
};

export namespace Bitcoin {

    export class RpcClient {

        protected readonly httpClient = undefined as unknown as ClientRequest;
        protected readonly rpchost = '127.0.0.1' as string;
        protected readonly rpcport = 8332 as number;
        protected readonly rpcscheme = 'http' as string;
        protected readonly rpcusername = '' as string;
        protected readonly rpcpassword = '' as string;

        constructor(cfg: any) {
            this.rpchost = cfg.rpchost;
            this.rpcport = cfg.rpcport;
            this.rpcscheme = cfg.rpcscheme;
            if ( cfg.rpcusername && cfg.rpcpassword ) {
                this.rpcusername = cfg.rpcusername;
                this.rpcpassword = cfg.rpcpassword;
            }
        }

        private createRequest() {

        }

        rpcCall(method: string, params: any[], result: Function): void {
            const reqOpts = {
                host: `${this.rpchost}:${this.rpcport}`,
                method: 'POST',
                protocol: this.rpcscheme
            } as any;
            if ( this.rpcusername && this.rpcpassword ) {
                reqOpts['username'] = this.rpcusername;
                reqOpts['password'] = this.rpcpassword;
            }
            const req = request(reqOpts);
            req.setHeader('Content-Type', 'application/json');
            req.on('connect', () => { log.debug(__name__, 'Rpc Connected!'); })
            req.write( generateRpcRequest(method, params), 'utf-8');

            let responseBody = '' as string;
            req.on('data', (chunk: Buffer) => {
                responseBody += chunk.toString();
            });
            req.end((datagram: any) => {
                log.debug(__name__, datagram);
                log.trace(responseBody);
                console.trace(' ');
/*
                if ( datagram.error ) {
                    log.error(__name__, datagram.error);
                    throw new Error(datagram.error);
                }
                result(datagram['result']);
//*/
            });
        }
    }
}


