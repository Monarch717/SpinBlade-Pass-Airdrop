import React, {useEffect, useState} from "react";
import mintPass_abi from "../utils/MintPass.json";
import {ethers} from "ethers";

// const mintPass = "0x61c4C67842D701AFe1237719D4cC37D8954aEa77";
// const mintPass = "0xE2F37E230679235dF12cc53836546717de35f00B";//Mumbai address of Ibrahim
const mintPass = "0xa21D3fc728efADf5fB3f55C43D1beF15B4398Fb2";//Polygon Mainnet of Ibrahim
let MintPassPortal;

export default function TokenSale() {

    const [currentAccount, setCurrentAccount] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [toAddresses, setToAddresses] = useState("");
    const [checkOwner, setCheckOwner] = useState(false);
    const [ownerAddress, setOwnerAddress] =useState("0xDa06d25df54Dd846e2f8126F0B944Fc5660F10ff");
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
            const toAddressArray_ = (toAddresses.split("\n"));
            let toAddressArray = [];
            toAddressArray_.forEach((response, index) => {
                toAddressArray.push(response.trim());
            })

            try {
                if (tokenId !== "" && toAddressArray.length > 0) {
                    let airdrop = await MintPassPortal.airDrop(toAddressArray, tokenId);
                    let response = await airdrop.wait()
                    if (response) {
                        alert("Airdrop is completed!\nTransaction Hash is : " + response.transactionHash);
                    }
                } else {
                    alert("Please enter Address list and token Id!");
                }

            } catch (e) {
                alert("You are not owner! or please insert correct address list");
            }

        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    {!currentAccount ? (
                            <p className="patner-connect-prev">Please Connect to Polygon Mainnet</p>
                        ) :
                        <div className="right-top-banner">
                            <p className="patner-connect-after">{currentAccount.slice(0, 7)} . .
                                . {currentAccount.slice(-5)}</p>
                        </div>
                    }
                    <p className="header gradient-text1">🎁 SpinBlade Pass Airdrop 🎁</p>
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
                                                  placeholder={`To Addresses here : you can separate addresses by enter key`}
                                                  onChange={(e) => {
                                                      setToAddresses(e.target.value);
                                                  }}/>
                                        <br/>
                                        <br/>
                                        <input className="tokenId w-50 p-3" type="number" placeholder="token id here : number"
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
                                    <br/><br/>
                                    <div>
                                        🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🌴🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵🪵
                                    </div>
                                </>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
