import { Interact } from "./connect"

export const getBalance = async () => {
    const { signer } = await Interact ();
    return await signer.getBalance ();
    // const { provider } = await Interact ();
    // const data = await provider.api.query.system.account (provider.api.active);
    // return 0;
}