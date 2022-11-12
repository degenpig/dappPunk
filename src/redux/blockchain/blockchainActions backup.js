// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import { tions } from "./tions";
// log
import { fetchData } from "../data/dataActions";

import Web3Modal from "web3modal";

export const createWeb3Modal = () => {
  const connectors = tions;
  const modal = new Web3Modal({ ...connectors, theme: "dark" });

  if (
    modal.cachedProvider &&
    !(modal.cachedProvider in connectors.tions)
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

      const web3 = new Web3(provider);

      web3.eth.extend({
        methods: [
          {
            name: "chainId",
            call: "eth_chainId",
            // outputFormatter: web3.utils.hexToNumber,
          },
        ],
      });

      subscribeProvider(provider);

      const accounts = await web3.eth.getAccounts();

      const address = accounts[0];
      console.log("Child1", provider);
      const chain_id = await web3.eth.getChainId();
      console.log("Child2");
      console.log(chain_id, provider.chainId, CONFIG.NETWORK.ID);
      let networkId = Number(provider.chainId || (await web3.eth.getChainId()));

      if (networkId === 86) {
        // Trust provider returns an incorrect chainId for BSC.
        networkId = 56;
      }
      if (networkId == CONFIG.NETWORK.ID) {
        Web3EthContract.setProvider(web3.currentProvider);
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
        dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`));
      }
    } catch (err) {
      console.log(err);
      dispatch(connectFailed("Something went wrong."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
