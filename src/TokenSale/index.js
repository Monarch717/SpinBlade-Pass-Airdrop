import React, {useEffect, useState} from "react";
import mintPass_abi from "../utils/MintPass.json";
import {ethers} from "ethers";

const mintPass = "0x61c4C67842D701AFe1237719D4cC37D8954aEa77";
let MintPassPortal;

export default function TokenSale() {

    const [currentAccount, setCurrentAccount] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [toAddresses, setToAddresses] = useState("");
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
            const toAddressArray = [];
            let airdrop = await MintPassPortal.airDrop(toAddressArray, tokenId);
            if (airdrop) {
                window.location.reload();
            }
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
    useEffect(async () => {
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
                        🔊 Only Contract Owner can make airdrop! 🔊
                    </p>
                    <div>
                        {!currentAccount ? (
                            <button onClick={connectWallet} className="cta-button connect-wallet-button">
                                Connect Wallet
                            </button>
                        ) : (
                            <>
                                <br></br>
                                <>
                                    <div>
                                        <textarea className="toAddresses w-50 p-3" rows={5}
                                                  placeholder={`To Addresses here : Type Array`}
                                                  onChange={(e) => {
                                                      setToAddresses(e.target.value);
                                                  }}/>
                                        <br/>
                                        <br/>
                                        <input className="tokenId w-50 p-3" type="number" placeholder="0"
                                               value={tokenId}
                                               onChange={(e) => {
                                                   setTokenId(e.target.value);
                                               }}/>
                                    </div>
                                    <br/>
                                    <div>
                                        <button className="cta-button connect-wallet-button" onClick={airdrop_func}>
                                            🪄 AirDrop 🪄
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
