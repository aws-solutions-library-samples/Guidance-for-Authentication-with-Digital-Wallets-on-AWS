import { Network, Alchemy } from 'alchemy-sdk';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

const headers = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods": "GET",
    'Access-Control-Allow-Origin': "*",
};

// Env variables are passed to the Lambda function
const settings = {
    apiKey: process.env.ALCHEMY_ETH_API_KEY,
    network: Network.ETH_MAINNET
};
const alchemy = new Alchemy(settings);

async function alchemyActions(username, action, chain = EvmChain.ETHEREUM) {
    switch (action) {
        case 'getNFTs':
            return await alchemy.nft.getNftsForOwner(username);
        case 'getCollection':
            break;
        default:
            throw 'Unknown action: ' + action;
    }
}

async function moralisActions(username, action, chain = EvmChain.ETHEREUM) {
    console.log("GO Moralis");
    switch (action) {
        case 'getNFTs':
            console.log("Moralis go init");

            await Moralis.start({
                apiKey: process.env.MORALIS_API_KEY
            });
            console.log("Moralis start done");

            console.log("Moralis go get");
            return await Moralis.EvmApi.nft.getWalletNFTs({
                address: username,
                chain,
            });
        default:
            throw 'Unknown action: ' + action;
    }
}

export const handler = async (event) => {
    var username = event.requestContext.authorizer.claims["cognito:username"];
    var output;

    try {
        console.log('Event: ', JSON.stringify(event, null, 2));

        if (!event?.queryStringParameters?.action)
            throw ('No action provided');

        if (!event?.queryStringParameters?.provider)
            throw ('No provider provided');

        switch (event.queryStringParameters.provider) {
            case 'Alchemy':
                output = await alchemyActions(username, event.queryStringParameters.action);
                break;
            case 'Moralis':
                output = await moralisActions(username, event.queryStringParameters.action);
                break;
            default:
                throw ('Unknown provider: ' + event.queryStringParameters.provider);
        }
        console.log("RESULT");
        console.log(JSON.stringify(output));

        return {
            headers,
            statusCode: 200,
            body: JSON.stringify(output),
        };
    } catch (error) {
        console.log("ERROR");
        console.log(JSON.stringify(error));
        return {
            headers,
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};