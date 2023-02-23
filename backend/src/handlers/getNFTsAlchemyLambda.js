import { Network, Alchemy } from 'alchemy-sdk';

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

export const handler = async (event) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    try {
        var username = event.requestContext.authorizer.claims["cognito:username"];
        var output;
        
        output = await alchemy.nft.getNftsForOwner(username);

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