import { DeFiConnector } from "deficonnect";
import WalletLink from "walletlink";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { connectors } from "web3modal";

export const providerOptions = {
  network: "polygon",
  cacheProvider: false,
  disableInjectedProvider: false,
  providerOptions: {
    injected: {
      display: {
        name: "MetaMask",
      },
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        network: "matic",
        rpc: {
          1: "https://pol0ygon-rpc.com/",
          137: "https://polygon-rpc.com/",
        },
      },
    },
    'custom-twt': {
      display: {
        name: 'Trust',
        description: 'Trust Wallet',
        logo: 'trust.png',
      },
      package: 'twt',
      connector: connectors.injected,
    },

    "custom-cb-bsc": {
      display: {
        logo: "coinbase.png",
        name: "Coinbase Wallet",
        description: "Connect to your Coinbase Wallet",
      },
      options: {
        appName: "Urban Kryptopunks",
        appLogoUrl: "config/images/logo.png",
        darkMode: false,
      },
      package: WalletLink,
      connector: async (ProviderPackage, options) => {
        const walletLink = new ProviderPackage(options);

        const provider = walletLink.makeWeb3Provider(
          "https://bsc-dataseed.binance.org/",
          56
        );

        await provider.enable();

        return provider;
      },
    },
    // "custom-cdc": {
    //   package: DeFiConnector,
    //   display: {
    //     logo: "crypto.png",
    //     name: "Crypto.com",
    //     description: "Crypto.com | Wallet Extension",
    //   },
    //   options: {
    //     supportedChainIds: [1],
    //     rpc: {
    //       1: "https://mainnet.infura.io/v3/9909c803d9cf47edb02820e4ad53d3ee",
    //       25: "https://evm-cronos.crypto.org/", // cronos mainet
    //     },
    //     pollingInterval: 15000,
    //   },
    //   connector: async (packageConnector, options) => {
    //     const connector = new packageConnector({
    //       name: "Cronos",
    //       supprtedChainTypes: ["eth"],
    //       supportedChainTypes: ["eth"],
    //       eth: options,
    //       cosmos: null,
    //     });
    //     await connector.activate();
    //     const provider = await connector.getProvider();

    //     return provider;
    //   },
    // },
    //  "custom-cdc": {
    //   package: DeFiConnector,
    //   display: {
    //     logo: "crypto.png",
    //     name: "Crypto.com",
    //     description: "Crypto.com | Wallet Extension",
    //   },
    //   options: {
    //     supportedChainIds: [1],
    //     rpc: {
    //       1: "https://mainnet.infura.io/v3/9909c803d9cf47edb02820e4ad53d3ee",
    //       25: "https://evm-cronos.crypto.org/", // cronos mainet
    //     },
    //     pollingInterval: 15000,
    //   },
    //   connector: async (packageConnector, options) => {
    //     const connector = new packageConnector({
    //       name: "Cronos",
    //       supprtedChainTypes: ["eth"],
    //       supportedChainTypes: ["eth"],
    //       eth: options,
    //       cosmos: null,
    //     });
    //     await connector.activate();
    //     const provider = await connector.getProvider();

    //     return provider;
    //   },
    // },



    /// trust wallet
    // "custom-cdc": {
    //   package: WalletConnectProvider,
    //   display: {
    //     logo: "trust.png",
    //     name: "Trust Wallet",
    //     description: "Connect You Trust Wallet",
    //   },
    //   options: {
    //     supportedChainIds: [56],
    //     rpc: {
    //       56: 'https://bridge.walletconnect.org'// cronos mainet
    //     },
       
    //   },
    //   connector: async (packageConnector, options) => {
    //     const connector = new packageConnector({
    //       name: "Cronos",
    //       supprtedChainTypes: ["eth"],
    //       supportedChainTypes: ["eth"],
    //       eth: options,
    //       cosmos: null,
    //     });
    //     await connector.activate();
    //     const provider = await connector.getProvider();

    //     return provider;
    //   },
    // },



  },
};
