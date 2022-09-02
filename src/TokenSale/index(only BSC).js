import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connector";

let isConfirm = false

function TokenSale() {
    const { account, activate, deactivate, error, active, chainId } = useWeb3React();

    const handleLogin = () => {
        isConfirm = true;
        localStorage.setItem("accountStatus", "1");
        return activate(injected);
    }

    const handleLogout = () => {
        isConfirm = false
        localStorage.removeItem("accountStatus")
        deactivate()
    }

    useEffect(() => {
        if (!chainId && isConfirm) {
            const { ethereum } = window;
            (async () => {
                try {
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x38" }],
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        try {
                            await ethereum.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: "0x38",
                                        chainName: "Smart Chain",
                                        nativeCurrency: {
                                            name: "BNB",
                                            symbol: "BNB",
                                            decimals: 18,
                                        },
                                        rpcUrls: ["https://bsc-dataseed.binance.org/"],
                                        blockExplorerUrls: ["https://bscscan.com/"],
                                    },
                                ],
                            });
                        } catch (addError) {
                            console.error(addError);
                        }
                    }
                }
                activate(injected);
            })();
            isConfirm = false;
        }
    }, [account, error]);

    useEffect(() => {
        if (!active && localStorage.getItem("accountStatus")) {
            activate(injected);
        }
    }, []);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <br/><br/>
                    <p className="header gradient-text1">Buy QFND Security Token Today</p>
                    
                    <p className="sub-text1 gradient-text2">
                        Send your BUSD and Receive QFND
                    </p>
                    <p className="sub-text2 gradient-text2">
                        BUSD : QFUND = 1 : 1
                    </p>
                    <br/>
                    <div>
                        {!account ? (
                            <button onClick={handleLogin} className="cta-button connect-wallet-button">
                                Connect Wallet
                            </button>
                        ) : (
                            <>
                            <button onClick={handleLogout} className="cta-button connect-wallet-button">
                                Disconnect Wallet
                            </button>
                            <br></br>
                            <br></br>

                            <div>
                                <input type="number" onChange={(e) => {

                                }}
                                />
                            </div>
                            <br/>
                            <div>
                                <button className="cta-button connect-wallet-button">
                                    BUY QFND
                                </button>
                            </div>
                            </>
                        )}
                    </div>
                    <br/><br/>
                    <a href="https://www.quantfund.finance/" target="_blank" className="patner-link">About QuantFund Finance</a>
                </div>

            </div>
        </div>
    )
}

export default TokenSale