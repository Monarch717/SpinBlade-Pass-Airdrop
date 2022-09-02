import Web3 from "web3";


const currentProvider = new Web3.providers.HttpProvider("https://matic-mumbai.chainstacklabs.com");

const getMumbaiWeb3 = () => {
    const web3 = new Web3(currentProvider);
    return web3;
}

export default getMumbaiWeb3;