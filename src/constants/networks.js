const networks = {
    reef_testnet: {
        rpc: 'wss://rpc-testnet.reefscan.com/ws',
        contracts: {
            marketplace: '0x462233Eacaac75d1294e2eCd0Dd37115CDaAdF15',
            erc1155: '0x87121574870Df9ea844e95301aA575f46844577D',
            // utility: '0xc857bb5C1D062c465a1B3Cf8af19635cC3B8e1Bc',
            // wrapper: '0x304377e6c790347B978B6E496829011e43E43Aa2'
        },
        backend: `https://coralmarketplacesystems.xyz`
    },
    reef_mainnet: {}
}


export default networks;