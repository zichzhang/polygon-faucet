# Polygon Faucet

A faucet to fund a wallet with $MATIC tokens.

## Preview (to be deployed)

Google OAuth Sign In       |  Authenticated
:-------------------------:|:-------------------------:
<img width="1440" alt="Screen Shot 2022-11-07 at 10 20 43 PM" src="https://user-images.githubusercontent.com/65128992/200467634-050b4df7-3cad-468a-87d9-cd8989c3315b.png"> | <img width="1440" alt="Screen Shot 2022-11-07 at 10 20 59 PM" src="https://user-images.githubusercontent.com/65128992/200467664-dacc5462-7506-4591-b114-0aeafadafb63.png">


* Note: frontend design was inspired by Anish Agnihotri

## Installation

1. Clone the repo
2. Edit the configuration
3. Send some ether to the wallet specified in config
4. If you turn on the ERC20 module, send some of your tokens to the wallet specified in config
5. `npm start` (starts the server locally)

## Configuration

To tell the faucet how to work, do this:

```sh
cp .env.example .env
vim .env
```

Then just change the parameters in the `.env` file.

### ETH_PRIVATE_KEY

Paste your private key here. This wallet will be used to drip ETH.

**Important** you must remove the `0x` from the start of the key.

### ETH_PAYOUT

Defines how much Ether you'll give per request.

### ETH_NODE_URL

Url of the Ethereum node you'll be connecting to. Here are some examples:

- `https://ropsten.infura.io` - Infura Ropsten over HTTP
- `wss://ropsten.infura.io` - Infura Ropsten over WebSocket
- `https://rinkeby.infura.io` - Infura Rinkeby over HTTP
- `https://kovan.infura.io` - Infura Kovan over HTTP
- `http://178.33.23.12` - Your GETH node running on a VPS over HTTP
- `ws://178.33.23.12` - Your GETH node running on a VPS over WebSocket

### DEBUG_MESSAGES

If set, prints a few debug messages to the console whenever someone requests some ETH.

### FAUCET_DRIPS_ETH

If set, your faucet will drip ETH. If not, no API routes for ETH will be created.

### FAUCET_DRIPS_ERC20

If set, your faucet will drip your configured ERC20 token. If not, no API routes for your token will be created.

### ERC20_CONTRACT_ADDRESS

Address of your ERC20 token smart contract. Make sure that it's on the same testnet used by `ETH_NODE_URL`.

### ERC20_PRIVATE_KEY

Paste your private key here. This wallet will be used to drip your ERC20 token. Remember to send some ether to it too, it will be needed to transaction fees!

**Important** you must remove the `0x` from the start of the key.

### ERC20_ABI

JSON ABI of your ERC20 contract. You'll see that we included the default ERC20 ABI, so you most likely don't need to edit this. If you are using a different token standard like ERC777, than add your token's ABI here.

### ERC20_NAME

Enter the name of your token here, e.g. `'REW'`.

### ERC20_PAYOUT

Defines how much of your ERC20 token you'll give per request.

## API

The faucet exposes an API allowing CORS.

### ETH

#### GET /status/eth

Returns:

- `balance` - Remaining balance in the faucet ETH wallet
- `address` - Public address of the faucet ETH wallet
- `currency` - Currency that we're referring to. In this case it's always ETH.

#### GET /request/eth/:address

Allows you to request Ether to be sent to the `address`.

The request will be open until the transaction is mined, so don't be alarmed if it takes 30 sec - 1 min to finish. When calling it from front end, make sure to either do it in background and notify the user once it's complete, or to display some cat gifs while loading.

Parameters:

- `address` - Address that will receive Ether

Returns:

- `transactionHash` - You can use it to find the transaction on Etherscan
- `remainingBalance` - Faucet's remaining balance in ETH
- `amount` - Amount sent to the address

Possible errors:

- Throws an error if there is not enough ether in the faucet to complete the request
- Throws an error if you try to get ether for an address multiple times, while the first request wasn't yet mined

### ERC20

#### GET /status/:tokenName (e.g. /status/rew)

Returns:

- `balance` - Remaining balance in the faucet ETH wallet
- `address` - Public address of the faucet ETH wallet
- `currency` - Currency that we're referring to. Taken from `ERC20_NAME` config parameter.

#### GET /request/:tokenName/:address (e.g. /request/rew/0x123...)

Allows you to request your ERC20 token to be sent to the `address`.

The request will be open until the transaction is mined, so don't be alarmed if it takes 30 sec - 1 min to finish. When calling it from front end, make sure to either do it in background and notify the user once it's complete, or to display some cat gifs while loading.

Parameters:

- `address` - Address that will receive Ether

Returns:

- `remainingBalance` - Faucet's remaining balance in ERC20
- `amount` - Amount sent to the address

Possible errors:

- Throws an error if there is not enough ERC20 tokens in the faucet to complete the request
- Throws an error if you try to get tokens for an address multiple times, while the first request wasn't yet mined

## How it works

The faucet generates and signs raw transactions, then sending them to the blockchain. This means the you don't have to have your own GETH node with accounts unlocked, which is nice.

## Licence

MIT
