import React, {useEffect, useState, useMemo, useCallback} from "react";
import usdc_abi from "../utils/USDCabi.json";
import mint1155_abi from "../utils/Mint1155.json";
import mintPass_abi from "../utils/MintPass.json";
import getMumbaiWeb3 from "./getMumbaiWeb3.js";
import BigNumber from "bignumber.js";
import {ethers} from "ethers";

const mint1155_addr = "0x25A212DcA594267dDA29d1759D9553f116464D7e";
const mintPass = "0x61c4C67842D701AFe1237719D4cC37D8954aEa77";
const usdc_addr = "0x63542e008B27190fCa9C4bFfa17BD01f37D39f34";
let MintPortal;
let USDCPortal;
let MintPassPortal;


export default function TokenSale() {

    const [currentAccount, setCurrentAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [states, setStates] = useState({});
    const [isEnded, setIsEnded] = useState(false);
    const [mintPassAmount, setMintPassAmount] = useState("");
    const [freeClaimAmount, setFreeClaimAmount] = useState("");
    const [freeClaimBalance, setFreeClaimBalance] = useState(0);
    const [mintPassBalance, setMintPassBalance] = useState(0);
    const [privateSale, setPrivateSale] = useState("");
    const [publicSale, setPublicSale] = useState("");
    const [approveUSDC, setApproveUSDC] = useState(false);
    const [approvePass, setApprovePass] = useState(false);
    const [availableNFT, setAvailableNFT] = useState(0)
    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                console.log("Make sure you have metamask!");
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            const accounts = await ethereum.request({method: "eth_accounts"});

            if (accounts.length !== 0) {

                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account)
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const connectWallet = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                alert("Get Metamask!");
                return;
            }

            const accounts = await ethereum.request({method: "eth_requestAccounts"});
            console.log("Connected", accounts[0]);

            setCurrentAccount(accounts[0]);

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        if (localStorage.getItem('approve_usdc') === 'true') {
            setApproveUSDC(true);
        }
        if (localStorage.getItem('approve_pass') === 'true') {
            setApprovePass(true);
        }
    }, [])

    const Mint_Func = async () => {
        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            MintPortal = new ethers.Contract(mint1155_addr, mint1155_abi, signer);
            USDCPortal = new ethers.Contract(usdc_addr, usdc_abi, signer);
            console.log(currentAccount);
            let Amount = Number(amount);
            const date = Date.now() / 1000;

            if (date < publicSale) {
                alert("Not time to mint, please wait!");
            } else {
                if (Amount > availableNFT || Amount < 1) {
                    alert("You can not mint more than Limitation or less than zero!");
                } else {

                    let mint = await MintPortal.mint(currentAccount, Amount);
                    await mint.wait();
                    console.log("mint", mint);
                    alert("Mint is completed!")

                }
            }

        }
    }

    const mintPass_Func = async () => {
        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            MintPortal = new ethers.Contract(mint1155_addr, mint1155_abi, signer);
            USDCPortal = new ethers.Contract(usdc_addr, usdc_abi, signer);

            let mintPassAmount1 = Number(mintPassAmount);
            const date = Date.now() / 1000;
            if (date < privateSale) {
                alert("Not time to mint, Please wait!")
            } else {
                if (mintPassAmount1 > Number(mintPassBalance) || mintPassAmount1 < 1) {
                    alert("You can not mint much more or less than your holding amount!")
                } else {
                    let mintPass = await MintPortal.mintPass(mintPassAmount1);
                    await mintPass.wait();
                    console.log("mintPass", mintPass);
                    alert("Mint Pass is completed!")
                }
            }

        }
    }

    const freeClaim_Func = async () => {
        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            MintPortal = new ethers.Contract(mint1155_addr, mint1155_abi, signer);
            USDCPortal = new ethers.Contract(usdc_addr, usdc_abi, signer);

            let freeClaimAmount1 = Number(freeClaimAmount);
            const date = Date.now() / 1000;
            if (date < privateSale) {
                alert("Not time to mint, Please wait!")
            } else {
                if (freeClaimAmount1 > Number(freeClaimBalance) || freeClaimAmount1 < 1) {
                    alert("You can not mint much more or less than your holding amount!")
                } else {
                    let freeClaim = await MintPortal.freeClaimPass(freeClaimAmount1);
                    await freeClaim.wait();
                    console.log("freeClaim", freeClaim);
                    alert("Free Claim Pass is completed!")
                }
            }

        }
    }

    const approve_pass = async () => {
        const {ethereum} = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            MintPassPortal = new ethers.Contract(mintPass, mintPass_abi, signer);
            let approved = await MintPassPortal.setApprovalForAll(mint1155_addr, true);
            if (approved) {
                setApprovePass(true);
                localStorage.setItem('approve_pass', 'true');
                window.location.reload();
            }
        }
    }
    const approve_usdc = async () => {
        const {ethereum} = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            USDCPortal = new ethers.Contract(usdc_addr, usdc_abi, signer);
            let maxUint = new BigNumber(Number(ethers.constants.MaxUint256)).dividedBy(10 ** 6).toFixed(0);
            let approved = await USDCPortal.approve(mint1155_addr, maxUint);
            await approved.wait();
            if (approved) {
                setApproveUSDC(true);
                localStorage.setItem('approve_usdc', 'true');
            }
        }
    }

    useEffect(async () => {
        const {ethereum} = window;
        if (ethereum) {
            getContractData();
        }
    }, [currentAccount]);

    const getContractData = async () => {
        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            MintPortal = new ethers.Contract(mint1155_addr, mint1155_abi, signer);
            MintPassPortal = new ethers.Contract(mintPass, mintPass_abi, signer);

            // mintPass contract
            let mintPassAmount_ = await MintPassPortal.balanceOf(currentAccount, 0);
            setMintPassBalance(Number(mintPassAmount_));
            let freeClaimAmount_ = await MintPassPortal.balanceOf(currentAccount, 1);
            setFreeClaimBalance(Number(mintPassAmount_));
            //First edition box contract
            let amountsNFT_ = await MintPortal.amountsNFT(currentAccount);
            let amountsNFT = new BigNumber(Number(amountsNFT_)).dividedBy(10 ** 0).toFixed(0);
            let amountsNFTMinted_ = await MintPortal.amountsNFTMinted(currentAccount);
            let amountsNFTMinted = new BigNumber(Number(amountsNFTMinted_)).dividedBy(10 ** 0).toFixed(0);

            let availableNFTs = await MintPortal.availableNFTs();
            setAvailableNFT(Number(availableNFTs.amount));
            let checkUserActualAmount = await MintPortal.checkUserActualAmount();
            let checkUserMintedAmount = await MintPortal.checkUserMintedAmount();
            // let checkUserIds = await MintPortal.checkUserIds();
            let cost_ = await MintPortal.cost();
            let cost = new BigNumber(Number(cost_)).dividedBy(10 ** 6).toFixed(0);

            let currentAmount = await MintPortal.currentAmount();

            let nameCollection = await MintPortal.nameCollection();
            let nftAmountPerUser_ = await MintPortal.nftAmountPerUser();
            let nftAmountPerUser = Number(nftAmountPerUser_);

            let paused = await MintPortal.paused();
            let symbolCollection = await MintPortal.symbolCollection();
            let totalDrop_ = await MintPortal.totalDrop();

            //check public and private sale date
            let checkDrop = await MintPortal.checkDropInfo(Number(totalDrop_));
            let checkMintPassDate = new Date(Number(checkDrop.privateStartTime) * 1000).toUTCString().replace('GMT', 'UTC');
            let checkMintDate = new Date(Number(checkDrop.publicStartTime) * 1000).toUTCString().replace('GMT', 'UTC');

            setPrivateSale(checkDrop.privateStartTime);
            setPublicSale(checkDrop.publicStartTime);

            setStates({
                mintPassAmount: Number(mintPassAmount_),
                freeClaimAmount: Number(freeClaimAmount_),

                amountsNFT: amountsNFT,
                amountsNFTMinted: amountsNFTMinted,
                availableNFTs: Number(availableNFTs.amount),
                checkUserActualAmount: checkUserActualAmount,
                // checkUserIds: checkUserIds,
                cost: cost,
                currentAmount: currentAmount,
                nameCollection: nameCollection,
                nftAmountPerUser: nftAmountPerUser,
                paused: paused,
                symbolCollection: symbolCollection,
                checkMintPassDate: checkMintPassDate,
                checkMintDate: checkMintDate
            });
        }
    }

    const addWatchToken = async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const provider = window.ethereum;
        if (provider) {
            try {
                // wasAdded is a boolean. Like any RPC method, an error may be thrown.
                const wasAdded = await provider.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: usdc_addr,
                            symbol: "USDC",
                            decimals: "6",
                        },
                    },
                });

                if (wasAdded) {
                    // eslint-disable-next-line
                    console.log("Token was added");
                }
            } catch (error) {
                // TODO: find a way to handle when the user rejects transaction or it fails
            }
        }
    }

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    {!currentAccount ? (
                            <p className="patner-connect-prev">Please Connect to Rinkeby Testnet</p>
                        ) :
                        <div className="right-top-banner">
                            <p className="patner-connect-after">{currentAccount.slice(0, 7)} . .
                                . {currentAccount.slice(-5)}</p>
                            <button className="cta-button connect-wallet-button" onClick={addWatchToken}>Import USDC
                            </button>
                        </div>
                    }
                    <p className="header gradient-text1">ERC1155 NFT Minting Test</p>
                    <p className="sub-text1 gradient-text2">
                        You can mint NFTs using USDC
                    </p>
                    <p className="sub-text2 gradient-text2">
                        Total NFT amount of this collection is {states.amountsNFT ? states.amountsNFT : 0}
                    </p>
                    <p className="sub-text2 gradient-text2">
                        Name of collection is {states.nameCollection}
                    </p>
                    {currentAccount ? (
                        <>
                            <p className="sub-text3 gradient-text3">Private mint start at
                                : {states.checkMintPassDate}</p>
                            <p className="sub-text3 gradient-text3">Public mint start at : {states.checkMintDate}</p>
                            <p className="sub-text3 gradient-text3">Price of First Edition Box:
                                ${states.cost ? Number(states.cost) : 0}</p>
                            <p className="sub-text3 gradient-text3">Price of Mint Pass:
                                ${states.cost ? Number(states.cost) * 0.8 : 0}</p>
                            <p className="sub-text3 gradient-text3">Price of Free Claim Pass: $0</p>
                            <p className="sub-text3 gradient-text3">Available NFTs: {states.availableNFTs}</p>
                            <p className="sub-text3 gradient-text3">Balance of Your Mint
                                Pass: {states.mintPassAmount}</p>
                            <p className="sub-text3 gradient-text3">Balance of Your Free Claim
                                Pass: {states.freeClaimAmount}</p>
                            <p className="sub-text3 gradient-text3">Balance of NFTs: {states.amountsNFT}</p>
                            <p className="sub-text3 gradient-text3">Minted Amount: {states.amountsNFTMinted}</p>
                            <p className="sub-text3 gradient-text3">Minting limitation per
                                user: {states.nftAmountPerUser}</p>
                            <p className="sub-text3 gradient-text3">Name of collection: {states.nameCollection}</p>
                        </>
                    ) : <div></div>}
                    <div>
                        {!currentAccount ? (
                            <button onClick={connectWallet} className="cta-button connect-wallet-button">
                                Connect Wallet
                            </button>
                        ) : (
                            <>
                                <br></br>
                                <hr/>

                                <div>
                                    {!approveUSDC &&
                                    <button className="cta-button connect-wallet-button" onClick={approve_usdc}>
                                        Approve USDC
                                    </button>
                                    }
                                    &nbsp;&nbsp;&nbsp;
                                    {!approvePass &&
                                    <button className="cta-button connect-wallet-button" onClick={approve_pass}>
                                        Approve Pass
                                    </button>
                                    }
                                </div>

                                {approveUSDC && (
                                    <>
                                        <div>
                                            <input className="buy_input" type="number" placeholder="0" value={amount}
                                                   onChange={(e) => {
                                                       setAmount(e.target.value);
                                                   }}/>
                                        </div>
                                        <br/>
                                        <div>
                                            <button className="cta-button connect-wallet-button" onClick={Mint_Func}>
                                                Mint
                                            </button>
                                        </div>
                                    </>
                                )}

                                {states.freeClaimAmount > 0 && approvePass && (
                                    <>
                                        <hr/>
                                        <div>
                                            <input className="buy_input" type="number" placeholder="0"
                                                   value={freeClaimAmount}
                                                   onChange={(e) => {
                                                       setFreeClaimAmount(e.target.value);
                                                   }}/>
                                        </div>
                                        <br/>
                                        <div>
                                            <button className="cta-button connect-wallet-button"
                                                    onClick={freeClaim_Func}>
                                                Free Claim Pass
                                            </button>
                                        </div>
                                    </>
                                )}

                                {states.mintPassAmount > 0 && approveUSDC && approvePass && (
                                    <>
                                        <hr/>
                                        <div>
                                            <input className="buy_input" type="number" placeholder="0"
                                                   value={mintPassAmount}
                                                   onChange={(e) => {
                                                       setMintPassAmount(e.target.value);
                                                   }}/>
                                        </div>
                                        <br/>
                                        <div>
                                            <button className="cta-button connect-wallet-button"
                                                    onClick={mintPass_Func}>
                                                Mint Pass
                                            </button>
                                        </div>
                                    </>
                                )}
                                <hr/>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
