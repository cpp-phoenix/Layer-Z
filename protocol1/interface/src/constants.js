export const tokenContract = {
    307_32: {
        PROVIDER: "https://mevm.devnet.imola.movementlabs.xyz",
        REWARDS_CONTRACT: "0x1367082758bcaaee041992d56b53cbadeb477079",
        ALPHA_TOKEN_CONTRACT: "0x52b5b8ff61cfae415b77c0f92cd78bbd19170da1",
        PE_TOKEN_CONTRACT: "0xd4441ecbc073970c86a6c121c47f371d1d109cea",
        C_TOKEN_CONTRACT: "0x17e695ca08daba6f9b351008a2dd9d65cb8f679b",
        USDC_TOKEN_CONTRACT: "0x77325bF80225B7FDc1D7AdF3451db5A04A0973BB",
    }
}

export const activeStrategies = {
    307_32: [
        {
            token: "USDC",
            address: "0x77325bF80225B7FDc1D7AdF3451db5A04A0973BB",
            logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029",
            strategies: [
                {
                    months: 3,
                    ALPHA_CORE_CONTRACT: "0x2a464711409fc8487ab8a764f453368afbc0dad3",
                },
                {
                    months: 6,
                    ALPHA_CORE_CONTRACT: "0x4810f2280054f527788908f8d646dc70649b1cd0",
                },
                {
                    months: 9,
                    ALPHA_CORE_CONTRACT: "0xe11d993c1BDdf2D4B123B07939F98F91011b7937",
                },
                {
                    months: 12,
                    ALPHA_CORE_CONTRACT: "0x802A3f3CeDfDb0005C38E279C7e7a2c17d12E11f",
                }
            ]
        }
    ]
}
