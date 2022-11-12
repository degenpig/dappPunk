import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

import { createWeb3Modal } from "./redux/blockchain/blockchainActions";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });
  const [web3Modal, setModal] = useState(null);

  // useEffect(() => {
  //   setModal(createWeb3Modal());
  // }, []);

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    console.log(blockchain.smartContract.methods);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);
  // ==================== navbar ========================
  const [showNav, setShowNav] = useState(false)
  return (
    <>
      {/* <!-- ============ main header and about us ============= --> */}
      <div className="mainBanner">
        {/* <!-- ------- Header -------- --> */}
        <header>
          <div className="container">
            <div className="d-flex justify-content-evenly justify-content-sm-between align-items-center">
              <div className="logo my-2">
                <a href="/">
                  <img src="/images/logo.png" alt="logo" className="img-fluid logoImg" />
                </a>
              </div>
              <div className="my-2">
                <ul className={`navlist ${showNav ? 'showNavbar' : ""}`}>
                  <li className="closeNav" onClick={e => setShowNav(false)}><span className="display-5 fw-bold">&times;</span></li>
                  <li><a href="#howmint" className="nav-links" onClick={(e) => setShowNav(false)}>How to mint</a></li>
                  <li><a href="#about" className="nav-links" onClick={(e) => setShowNav(false)}>About Us</a></li>
                  <li><a href="#roadmap" className="nav-links" onClick={(e) => setShowNav(false)}>Roadmap</a></li>
                  <li><a href="#team" className="nav-links" onClick={(e) => setShowNav(false)}>Team</a></li>
                  <li><a href="#faqs" className="nav-links" onClick={(e) => setShowNav(false)}>Faqs</a></li>
                </ul>
              </div>
              <div onClick={(e) => !showNav ? setShowNav(true) : setShowNav(false)} className="menuButton ms-3 order-2 order-lg-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white" height="35px"><path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z" /></svg>
              </div>
              <div className="my-2 mx-auto mx-md-0 order-1 order-lg-2">
                <div className="d-flex">
                  <a href="https://www.instagram.com/urbankryptopunks/" target="_blank">
                    <img src="/images/insta.png" alt="insta" className="img-fluid mx-1 mx-xl-2 navSocial" />
                  </a>
                  <a href="https://twitter.com/UKryptopunks" target="_blank">
                    <img src="/images/twitter.png" alt="twitter" className="img-fluid mx-1 mx-xl-2 navSocial" />
                  </a>
                  <a href="https://discord.gg/TVFg6kfP" target="_blank">
                    <img src="/images/discord.png" alt="discord" className="img-fluid mx-1 mx-xl-2 navSocial" />
                  </a>
                  <a href="https://opensea.io/collection/urbankryptopunks" target="_blank">
                    <img src="/images/opensea.png" alt="opensea" className="img-fluid mx-1 mx-xl-2 navSocial" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* <!-- ---- main banner------- --> */}
        <div>
          <div className="container">
            <div className="row my-5 align-items-center flex-column-reverse flex-lg-row">
              <div className="col-lg-6">
                <div className="d-flex justify-content-center flex-column">

                  <h1 className="title text-white fw-bold h2 text-center title "><span style={{ color: "#2aecc5" }}>Mint</span> Your Urban  KryptoPunks </h1>
                  <div className="border-main d-inline-block">
                    <div className="centerall">
                      <h2 className="text-white text-lg-start text-center title supply">
                        {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                      </h2>
                      <h6 className="text-dark text-lg-start text-center my-2 title">
                        <a href={CONFIG.SCAN_LINK} target="_blank">
                          {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                        </a>
                      </h6>
                      <h4 className="text-center text-white text-lg-start  title">1 UK costs 0.6 Matic</h4>
                      <h5 className="text-lg-start text-center text-white title">Excluding gas fees</h5>
                      {
                        blockchain.account === "" ||
                          blockchain.smartContract === null
                          ?
                          <h5 className="text-white mb-2 text-center text-lg-start title">Connect to the polygon network</h5>
                          :
                          <h5 className="text-white mb-2 text-center text-lg-start title">Click buy to mint your nft</h5>
                      }
                    </div>
                  </div>
                  {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? "Soldout" :
                    <div className="buttonOnline">
                      {blockchain.account === "" ||
                        blockchain.smartContract === null ?
                        (<>
                          <div className="d-flex justify-content-center align-items-center">
                            <img src="/images/connect.png" alt="connect" className="img-fluid connect"
                              onClick={(e) => {
                                e.preventDefault();
                                dispatch(connect());
                                getData();
                              }}
                            />
                          </div>
                          {
                            blockchain.errorMsg !== "" ? window.alert(blockchain.errorMsg) : null
                          }
                        </>
                        ) : (
                          <>

                            <div className="d-flex flex-column align-items-center">
                              <div className="d-flex mt-3">
                                <button className="manageMint" disabled={claimingNft ? 1 : 0}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    decrementMintAmount();
                                  }}>-</button>
                                <button className=" mint h3">{mintAmount}</button>
                                <button className="manageMint" disabled={claimingNft ? 1 : 0}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    incrementMintAmount();
                                  }}>+</button>
                              </div>
                              <div className="mt-3">
                                <img src="/images/buy.png" alt="buy" style={{ height: "50px", cursor: "pointer" }} onClick={(e) => {
                                  e.preventDefault();
                                  claimNFTs();
                                  getData();
                                }} />
                                {/* <button className="mintNow" onClick={(e) => {
                              e.preventDefault();
                              claimNFTs();
                              getData();
                            }}>{claimingNft ? "BUSY" : "BUY"}</button> */}
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                  }
                </div>
              </div>
              <div className="col-lg-6">
                <div className="d-flex justify-content-center align-items-center">
                  <img src="/images/main.gif" alt="image" className="img-fluid p-4" style={{ maxHeight: "450px" }} />
                </div>
              </div>
              <div className="col-lg-10 mx-auto my-3 intro">
                <h5 className="text-white text-center p-2 p-md-4 mt-4 border-main">
                  Please make sure you are connected to the right network (
                  {CONFIG.NETWORK.NAME} Mainnet) and the correct address. <br />
                  Please note:
                  Once you make the purchase, you cannot undo this action.
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- ============= About us ============ --> */}
      <div className="about" >
        {/* <!-- ------- Heading ------- --> */}
        <div className="container m-100" id="howmint">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h2 className="title display-5 fw-bold text-white">How To Mint</h2>
            <img src="/images/heading.png" alt="heading" className="img-fluid" />
          </div>
        </div>
        {/* <!-- ---------How To Mint--------- --> */}
        <div className="container">
          {/* <div className="row">
            <div className="col-lg-10 mx-auto">
              <img src="/images/howToMint.jpeg" alt="how to mint" className="img-fluid" />
            </div>
          </div> */}

          <div className="row">
            <div className="owl-carousel owl-theme">
              <div className="item">
                <div className="row d-flex justify-content-center align-items-center">
                  <div className="col-lg-8"><img src="/images/step1.png" alt="How to mint Step 1" draggable="False" className="img-fluid disStep" /></div>
                  <div className="col-lg-8"><img src="/images/moStep1.png" alt="How to mint Step 1" draggable="False" className="img-fluid mobStep" /></div>
                </div>
              </div>
              <div className="item">
                <div className="row d-flex justify-content-center align-items-center">
                  <div className="col-lg-8"><img src="/images/step2.png" alt="How to mint Step 2" draggable="False" className="img-fluid disStep" /></div>
                  <div className="col-lg-8"><img src="/images/moStep2.png" alt="How to mint Step 2" draggable="False" className="img-fluid mobStep" /></div>
                </div>
              </div>
              <div className="item">
                <div className="row d-flex justify-content-center align-items-center">
                  <div className="col-lg-8"><img src="/images/step3.png" alt="How to mint Step 3" draggable="False" className="img-fluid disStep" /></div>
                  <div className="col-lg-8"><img src="/images/moStep3.png" alt="How to mint Step 3" draggable="False" className="img-fluid mobStep" /></div>
                </div>
              </div>
              <div className="item">
                <div className="row d-flex justify-content-center align-items-center">
                  <div className="col-lg-8"><img src="/images/step4.png" alt="How to mint Step 4" draggable="False" className="img-fluid disStep" /></div>
                  <div className="col-lg-8"><img src="/images/moStep4.png" alt="How to mint Step 4" draggable="False" className="img-fluid mobStep" /></div>
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* <!-- ------- Heading ------- --> */}
        <div className="container m-100" id="about">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h2 className="title display-5 fw-bold text-white">About Us</h2>
            <img src="/images/heading.png" alt="heading" className="img-fluid" />
          </div>
        </div>
        {/* <!-- ------------------ --> */}
        <div className="container">
          <div className="row mb">
            <div className="col-lg-6 my-3 mb-5">
              <h2 className="theme">We are the Urban Kryptopunks</h2>
              <p className="text-white lh-lg h5">
                Numerous cryptopunk collections have come before us. We truly appreciate the original cryptopunks (larva lab) for blazing the path but Urban Kryptopunks are the dopest punks in the uni/metaverse.
                Urban Kryptopunks is a collection of 10,000 uniquely designed punks with a variety of attributes for multiple levels of rarities.Base out of Seattle, Urban Kryptopunks are coming to turn the uni/metaverse world out.
              </p>
              <p className="text-white lh-lg h5">
                With ourLegendary punks (3D)coming , fashion apparel, events, music, and plenty of surprises, Urban Kryptopunks(UK) will position itself as one of the top communities in the crypto space period. Do not miss out on this opportunity to be a part of something special!
              </p>
            </div>
            <div className="col-lg-6 my-3 mb-5">
              <div className="d-flex justify-content-center align-items-center">
                <img src="/images/about1.png" alt="about" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>

        {/* <!-- ============ Roadmap =========== --> */}
        <div id="roadmap">
          {/* <!-- ------- Heading ------- --> */}
          <div className="container m-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h2 className="title display-5 fw-bold text-white">Roadmap</h2>
              <img src="/images/heading.png" alt="heading" className="img-fluid" />
            </div>
          </div>
          {/* <!-- ------------------ --> */}
          <div className="container">
            <div className="row justify-content-center ">
              <div className="col-lg-8 mx-auto mb-0">
                <h5 className="text-center text-white mb-5 lh-lg">
                  Our journey is just beginning. With so many possibilites and unknowns in the web3 space, the roadmap will adjust but when it does, it will always adjust for the better.
                </h5>
              </div>
              {/* ============================================================================================= */}
              <section className="BgPlayerRoadmap">

                <div className="container">
                  <div className="timeline">
                    <ul>
                      <li>
                        <div className="content">
                          {/* <h3 className="theme fw-bold">10-20</h3> */}
                          <p className="lh-lg h6">
                          Private and public minting. We will Release 9500 uniquely designed 2d version. 500 will be held for raffles, whitelist, giveaways, employees, etc.This will grant holders commercial access to future projects.This will also give you access to events, community voting on upcoming projects, and merch drops. 
                          </p>
                        </div>
                        <div className="time">
                          <h4>10 - 20</h4>
                        </div>
                      </li>

                      <li>
                        <div className="content">
                          {/* <h3 className="theme fw-bold">30-40</h3> */}
                          <p className="lh-lg h6">
                          Marketing is the key component to take this to the moon. We will explore several options for optimal advertising to increase the community and bring awareness. Whether it's social media or physical, once people see what's going on, they will fight to be a part of it. The community is going to be a big part of marketing as well. Partnering with the right communities is essential to our growth, we will strategically adapt to  the communities that has our same vision.
                          </p>
                        </div>
                        <div className="time">
                          <h4>30 - 40</h4>
                        </div>
                      </li>

                      <li>
                        <div className="content">
                          {/* <h3 className="theme fw-bold">50-60</h3> */}
                          <p className="lh-lg h6">
                          We will reveal sneak-peeks of our apparel collection for our community such as hats and sweatshirts.  We're already working on the legendary 3D models which will show a couple of them after the reveal to get the community really excited. We will also start showing off fashion apparel for our 3D models as well. The community will be able to vote on the fashion apparel direction. 
                          </p>
                        </div>
                        <div className="time">
                          <h4>50 - 60</h4>
                        </div>
                      </li>
                      <li>
                        <div className="content">
                          {/* <h3 className="theme fw-bold">70-80</h3> */}
                          <p className="lh-lg h6">
                          We will launch the legendardy 3D models. We are also working on another project for diamond hands. This project is gonna be worth the wait. We're also going to release our full fashion line.  
                          </p>
                        </div>
                        <div className="time">
                          <h4>70 - 80</h4>
                        </div>
                      </li>
                      <li>
                        <div className="content">
                          {/* <h3 className="theme fw-bold">90-100</h3> */}
                          <p className="lh-lg h6">
                          Working on Meterverse implementation, Play to earn games, and so much more.This is just the beginning. You deserve to be part of something special! LFG!!!!! Much Love Kryptopunkians
                          </p>
                        </div>
                        <div className="time">
                          <h4>90 - 100</h4>
                        </div>
                      </li>
                      <div style={{ clear: "both" }}></div>
                    </ul>
                  </div>
                </div>

              </section>
              {/* ============================================================================================= */}
            </div>
          </div>
        </div>
      </div>
      {/* ================ OUR FUTURE ============= */}
      <div className="future">
        {/* <!-- ------- Heading ------- --> */}
        <div className="container m-100">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h2 className="title display-5 fw-bold text-white">OUR FUTURE</h2>
            <img src="/images/heading.png" alt="heading" className="img-fluid" />
          </div>
        </div>
        {/* <!-- ------------------ --> */}
        <div className="container pb-5">
          <div className="row">
            <div className="col-xl-10 mx-auto">
              <div className="d-flex justify-content-center">
                <img src="/images/future.png" alt="future" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- ============= Team ============== --> */}
      <div className="about" id="team">
        <div className="team">
          {/* <!-- ------- Heading ------- --> */}
          <div className="container m-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h2 className="title display-5 fw-bold text-white">Our Team</h2>
              <img src="/images/heading.png" alt="heading" className="img-fluid" />
            </div>
          </div>
          {/* <!-- ------------------ --> */}
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-lg-3 my-4">
                <div className="d-flex flex-column align-items-center">
                  <img src="/images/team_1.png" alt="team" className="img-fluid" />
                  <h2 className="text-center text-white">Charliezcomet</h2>
                  <h5 className="text-center text-white">Founder, Artist</h5>
                </div>
              </div>
              <div className="col-lg-3 my-4">
                <div className="d-flex flex-column align-items-center">
                  <img src="/images/team_3.png" alt="team" className="img-fluid" />
                  <h2 className="text-center text-white">Muhammad</h2>
                  <h5 className="text-center text-white">Developer</h5>
                </div>
              </div>
              <div className="col-lg-3 my-4">
                <div className="d-flex flex-column align-items-center">
                  <img src="/images/team_2.png" alt="team" className="img-fluid" />
                  <h2 className="text-center text-white">Donda</h2>
                  <h5 className="text-center text-white">Developer</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- ============= Faq's =============--> */}
        <div className="faq" id="faqs">
          {/* <!-- ------- Heading ------- --> */}
          <div className="container m-100">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h2 className="title display-5 fw-bold text-white">FAQ's</h2>
              <img src="/images/heading.png" alt="heading" className="img-fluid" />
            </div>
          </div>
          {/* <!-- ------------------ --> */}
          <div className="container">

            <div className="row">
              <div className="col-1"></div>

              <div className="col-lg-10">
                <div className="accordion accordion-flush" id="accordionFlushExample">

                  <div className="accordion-item">
                    <h2 className="accordion-header  wow fadeInRight" id="flush-headingOne">
                      <button className="accordion-button collapsed fs-12 Line_Height" type="button"
                        data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false"
                        aria-controls="flush-collapseOne">
                        What is an NFT?
                      </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                      <div className="accordion-body content fs-12 content_res text-white">
                        is a non-interchangeable unit of data stored on a blockchain, a form of digital ledger, that can be sold and traded.[1] Types of NFT data units may be associated with digital files such as photos, videos, and audio. Because each token is uniquely identifiable, NFTs differ from blockchain cryptocurrencies , such as Bitcoin.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header wow fadeInLeft" id="flush-headingTwo" data-wow-delay="0.2s">
                      <button className="accordion-button collapsed fs-12 Line_Height" type="button"
                        data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false"
                        aria-controls="flush-collapseTwo">
                        What are Urban Kryptopunks?
                      </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                      <div className="accordion-body content fs-12 content_res lh-lg text-white">
                        Inspired by the infamous cyptopunks from Lava lab(not affiliated), urban kryptopunks are 24x24 pixel art generated algorithmically. These are modern urban looking types of punks from all nationalities. Some rarer types are alien, rose gold, and purple. Each punk has attributes which makes them unique.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header wow fadeInRight" id="flush-headingThree" data-wow-delay="0.4s">
                      <button className="accordion-button collapsed fs-12 Line_Height" type="button"
                        data-bs-toggle="collapse" data-bs-target="#flush-collapseThree"
                        aria-expanded="false" aria-controls="flush-collapseThree">
                        How can I join the community?
                      </button>
                    </h2>
                    <div id="flush-collapseThree" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                      <div className="accordion-body content fs-12 content_res lh-lg text-white">
                        Discord is where all the announcements are going to be made. <a href="https://discord.gg/TVFg6kfP" target="_blank" className="theme">
                          <u>
                            Click Here to get started.
                          </u>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header wow fadeInLeft" id="flush-headingfour" data-wow-delay="0.6s">
                      <button className="accordion-button collapsed fs-12 Line_Height" type="button"
                        data-bs-toggle="collapse" data-bs-target="#flush-collapsefour" aria-expanded="false"
                        aria-controls="flush-collapsefour">
                        What are crypto wallets ?
                      </button>
                    </h2>
                    <div id="flush-collapsefour" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingfour" data-bs-parent="#accordionFlushExample">
                      <div className="accordion-body content lh-lg content_res text-white">
                        There are basically like email login for the crypto space. You can make a wallet for free to search or buy crypto.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header wow fadeInRight" id="flush-headingfive" data-wow-delay="0.8s">
                      <button className="accordion-button collapsed fs-12 Line_Height" type="button"
                        data-bs-toggle="collapse" data-bs-target="#flush-collapsefive" aria-expanded="false"
                        aria-controls="flush-collapsefive">
                        Are they secure?
                      </button>
                    </h2>
                    <div id="flush-collapsefive" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingfive" data-bs-parent="#accordionFlushExample">
                      <div className="accordion-body content content_res lh-lg text-white">
                        Yes. Using wallets like coinbase, Crypto defi, trust, and metamask are tops in the crypto space for security.But like a regular wallet, if you lose it or login into the wrong crypto sites, you could get scammed so be careful who you trust with your information.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header wow fadeInRight" id="flush-headingsix" data-wow-delay="0.8s">
                      <button className="accordion-button collapsed fs-12 Line_Height" type="button"
                        data-bs-toggle="collapse" data-bs-target="#flush-collapsesix" aria-expanded="false"
                        aria-controls="flush-collapsesix">
                        What happens after I buy the NFT?
                      </button>
                    </h2>
                    <div id="flush-collapsesix" className="accordion-collapse collapse"
                      aria-labelledby="flush-headingsix" data-bs-parent="#accordionFlushExample">
                      <div className="accordion-body content content_res lh-lg text-white">
                        Once you buy the NFT, you will be able to view it on opensea.io
                        Connect your wallet and you will be able to see the hidden NFT. Once its reveal , you will be able to see which one you received.
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="col-1"></div>
            </div>

          </div>
        </div>
        {/* <!-- ============= Footer ============= --> */}
        <footer className="footer mt-5">
          <div className="container">
            <div className="d-flex justify-content-lg-between align-items-center py-3 flex-wrap justify-content-center">
              <div className="logo-footer">
                <a href="/">
                  <img src="/images/logo.png" className="img-fluid" alt="logo" />
                </a>
              </div>
              <div className="d-flex social mt-3">
                <a href="https://www.instagram.com/urbankryptopunks/" target="_blank">
                  <img src="/images/insta.png" alt="insta" className="img-fluid mx-2" />
                </a>
                <a href="https://twitter.com/UKryptopunks" target="_blank">
                  <img src="/images/twitter.png" alt="twitter" className="img-fluid mx-2" />
                </a>
                <a href="https://discord.gg/TVFg6kfP" target="_blank">
                  <img src="/images/discord.png" alt="discord" className="img-fluid mx-2" />
                </a>
                <a href="https://opensea.io/collection/urbankryptopunks" target="_blank">
                  <img src="/images/opensea.png" alt="opensea" className="img-fluid mx-2" />
                </a>
              </div>
            </div>
            <hr className="bg-white" />
            <p className="text-white text-center">
              All right reserved.© Urban Kryptopunks 2022
            </p>
          </div>
        </footer>
        {/* <!-- =================================== --> */}
      </div>
    </>
  );
}

export default App;
