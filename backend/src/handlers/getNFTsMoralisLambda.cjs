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

module.exports.handler = async (event) => {
    console.log("Events: ", JSON.stringify(event));

    try {
        var username = event.requestContext.authorizer.claims["cognito:username"];
        var output;

        const chain = (!event?.queryStringParameters?.chain ? Chains.EvmChain.ETHEREUM : event.queryStringParameters.chain);

        output = await Moralis.EvmApi.nft.getWalletNFTs({
            address: username,
            chain: chain,
        });

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
