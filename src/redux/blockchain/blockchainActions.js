// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import { providerOptions } from "./providerOptions";
// log
import { fetchData } from "../data/dataActions";

import Web3Modal from "web3modal";
import { ethers } from "ethers";

export const createWeb3Modal = () => {
  const connectors = providerOptions;
  // const modal = new Web3Modal({ ...connectors, theme: "dark" });
  const modal = new Web3Modal({
    // cacheProvider: true, // optional
    ...providerOptions, // required
  });
  if (
    modal.cachedProvider &&
    !(modal.cachedProvider in connectors.providerOptions)
  ) {
    modal.clearCachedProvider();
  }

  return modal;
};

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

const subscribeProvider = (provider) => {
  if (!provider.on) {
    return;
  }
  provider.on("accountsChanged", async (accounts) => {
    if (accounts[0]) {
      dispatch(updateAccount(accounts[0]));
    }
  });
  provider.on("chainChanged", async (chainId) => {
    // const networkId = web3.utils.isHex(chainId) ? web3.utils.hexToNumber(chainId) : chainId;
    window.location.reload();
  });
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());

    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const CONFIG = await configResponse.json();

    let web3Modal = createWeb3Modal();
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      console.log(provider);
      console.log(library);
      subscribeProvider(provider);
      const web3 = new Web3(provider);
      const chain_id = network.chainId;
      let networkId = chain_id;

      if (networkId == CONFIG.NETWORK.ID) {
        Web3EthContract.setProvider(provider);
        const SmartContractObj = new Web3EthContract(
          abi,
          CONFIG.CONTRACT_ADDRESS
        );
        dispatch(
          connectSuccess({
            account: accounts[0],
            smartContract: SmartContractObj,
            web3: web3,
          })
        );
      } else {
        // } else {
        //   alert('eth')
        // }
        dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`));
      }
      console.log(network.chainId);
    } catch (error) {
      if (!window.ethereum) {
        window.open('https://metamask.app.link/dapp/www.urbankryptopunks.com/')
      }
      console.log(error);
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
