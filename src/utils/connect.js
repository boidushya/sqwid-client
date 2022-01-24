import { Provider, Signer } from "@reef-defi/evm-provider";
import { WsProvider } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromSource } from "@polkadot/extension-dapp";
import { stringToHex } from '@polkadot/util';
import axios from "axios";
import { getBackend, getRPC } from "./network";
// const WS_URL = 'wss://rpc-testnet.reefscan.com/ws';

let provider;

const Init = async () => {
    await web3Enable ('Sqwid');
    return await web3Accounts();
}

const Connect = async (account) => {
	const injector = await web3FromSource (account.meta.source);

	const signRaw = injector?.signer?.signRaw;

    const { signer } = await Interact (account.address);

    const backend = getBackend ();

	if (!!signRaw) {
        if (!(await signer.isClaimed())) {
            return {
                evmClaimed: false,
                signer
            }
        }
        // return;
        let res = await axios.get(`${backend}/user/nonce/${account.address}`);
        let nonce = res.data;

        const sres = await signRaw ({
			address: account.address,
			data: stringToHex ("Sign this nonce to authenticate in Sqwid Marketplace: " + nonce),
			type: 'bytes'
		});
        let error = null;

        const { signature } = sres;
		try{
			res = await axios (`${backend}/authenticate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				data: JSON.stringify ({
					publicAddress: account.address,
					signature: signature,
                    evmAddress: await signer.getAddress (),
				})
			});
		}
		catch(err){
            // handle err like a normal person 👍
            error = err;
		}

        if (!error) {
            let json = res.data;
            localStorage.removeItem ('collections');
            let jwts = localStorage.getItem ('tokens');
            jwts = jwts ? JSON.parse (jwts) : [];

            let item = jwts.find (jwt => jwt.address === account.address);
            if (item) {
                item.token = json.token;
            } else {
                jwts.push ({
                    name: account.meta.name,
                    address: account.address,
                    token: json.token
                });
            }

            localStorage.setItem ('tokens', JSON.stringify (jwts));

            return {
                evmClaimed: await signer.isClaimed (),
                signer
            }
        }
	}
}

const Interact = async (address = null) => {
    if (!address) address = JSON.parse (localStorage.getItem ("auth"))?.auth.address;
    const allInjected = await web3Enable ('Sqwid');
    const injected = allInjected[0].signer;
    if (!provider) provider = new Provider ({
        provider: new WsProvider (getRPC ())
    });
    await provider.api.isReady;

    const signer = new Signer (provider, address, injected);

    return {
        signer,
        provider
    }
}

const GetProvider = async () => {
    if (!provider) provider = new Provider ({
        provider: new WsProvider (getRPC ())
    });
    await provider.api.isReady;
    return provider;
}


export { Connect, Init, Interact, GetProvider };
