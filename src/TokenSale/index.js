import React, {useEffect, useState, useMemo, useCallback} from "react";
import mintPass_abi from "../utils/MintPass.json";
import getMumbaiWeb3 from "./getMumbaiWeb3.js";
import BigNumber from "bignumber.js";
import {ethers} from "ethers";

const mint1155_addr = "0x25A212DcA594267dDA29d1759D9553f116464D7e";
const mintPass = "0x61c4C67842D701AFe1237719D4cC37D8954aEa77";
let MintPassPortal;


export default function TokenSale() {

    const [currentAccount, setCurrentAccount] = useState("");
    const [tokenId, setTokenId] = useState("");
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

    const airdrop_func = async () => {
        const {ethereum} = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            MintPassPortal = new ethers.Contract(mintPass, mintPass_abi, signer);
            let approved = await MintPassPortal.setApprovalForAll(mint1155_addr, true);
            if (approved) {
                window.location.reload();
            }
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
    useEffect(async () => {
        const {ethereum} = window;
    }, [currentAccount]);

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
                        </div>
                    }
                    <p className="header gradient-text1">🎁 SpinBlass Pass Airdrop 🎁</p>
                    <p className="sub-text1 gradient-text2">
                        You can mint NFTs using USDC
                    </p>
                    <p className="sub-text2 gradient-text2">
                    </p>
                    <p className="sub-text2 gradient-text2">
                    </p>
                    <div>
                        {!currentAccount ? (
                            <button onClick={connectWallet} className="cta-button connect-wallet-button">
                                Connect Wallet
                            </button>
                        ) : (
                            <>
                                <br></br>
                                <hr/>

                                <>
                                    <div>
                                        <input className="tokenId" type="number" placeholder="0" value={tokenId}
                                               onChange={(e) => {
                                                   setTokenId(e.target.value);
                                               }}/>
                                    </div>
                                    <br/>
                                    <div>
                                        <button className="cta-button connect-wallet-button" onClick={airdrop_func}>
                                            AirDrop
                                        </button>
                                    </div>
                                </>
                                <hr/>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
