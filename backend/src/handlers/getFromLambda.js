'use strict';
import { Network, Alchemy } from 'alchemy-sdk';

const headers = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods": "GET",
    'Access-Control-Allow-Origin': "*",
};

// Settings to customize using prod.parameters file
const settings = {
    apiKey: process.env.ALCHEMY_ETH_API_KEY,
    network: Network.ETH_MAINNET
};
const alchemy = new Alchemy(settings);

export const handler = async (event) => {

    try {
        console.log('Event: ', JSON.stringify(event, null, 2));
        console.log('API KEY: ', process.env.ALCHEMY_ETH_API_KEY);
        console.log('Network: ', Network.ETH_MAINNET);



        console.log("Call alchemy");
        const nfts = await alchemy.nft.getNftsForOwner(event.requestContext.authorizer.claims["cognito:username"]);
        console.log("RESULT");
        console.log(nfts);
        return {
            headers,
            statusCode: 200,
            body: JSON.stringify(nfts),
        };
    } catch (error) {
        console.log("ERROR");
        console.log(error);
        return {
            headers,
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};