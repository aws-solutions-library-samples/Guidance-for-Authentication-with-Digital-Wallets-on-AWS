"use strict";

const Moralis = require("moralis").default;
const Chains = require("@moralisweb3/common-evm-utils");

const headers = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods": "GET",
    'Access-Control-Allow-Origin': "*",
};

const startMoralis = async () => {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
    });
};
  
startMoralis();

async function moralisActions(username, action) {
    console.log("GO Moralis");
    switch (action) {
        case 'getNFTs':
            console.log("Moralis go get");
            return await Moralis.EvmApi.nft.getWalletNFTs({
                address: username,
                chain: Chains.EvmChain.ETHEREUM,
            });
        default:
            throw 'Unknown action: ' + action;
    }
}

module.exports.handler = async (event) => {
    var username = event.requestContext.authorizer.claims["cognito:username"];
    var output;

    try {
        console.log("Events: ", JSON.stringify(event));

        if (!event?.queryStringParameters?.action)
            throw ('No action provided');

        const chain = (!event?.queryStringParameters?.chain ? Chains.EvmChain.ETHEREUM : event.queryStringParameters.chain);

        output = await moralisActions(username, event.queryStringParameters.action);

        console.log("RESULT");
        console.log(output);

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
