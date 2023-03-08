# NFT Gallery dApp Guide

*Important*: Make sure you deploy the backend component of the project first.

This is a ReactJs Single Page Application.

This decentralized application (dApp) supports the Ethereum blockchain.
It connects to your API Gateway to retrieve NFTs from Web3 providers such as Alchemy or Moralis. 
It resolves IPFS URIs and NFT `.json` metadata files and displays details about the NFTs. 

Anonymous users can do a NFT collection lookup. All other operations requires the user to be authenticated.

Authentication is done using a series of Cognito User Pool Lambda triggers.
See: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html

The authentication challenge is the signature of a random message on the blockchain by the connected wallet.
If the signature is valid, Cognito will create a new identity in the Cognito User Pool and will return temporary credentials.

## Deployment 

Rename the `.env.example` file to `.env` and update the values there. Some values referenced in this environment file are the backend resources created earlier and are available as output of the `sam deploy` command or in the `Output` tab of the Cloud Formation stack.

Then run `yarn` and `yarn dev` to start the webserver.

You can access the dApp on http://localhost:3000/

## Next.js config

In order to be able to display images from any domains we added the following to the `next.config.js` file.

```
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
```

## CORS management

Our JS code needs to get the `.json` metadata file referenced in the NFT token on the blockchain. 

Even though NFTs should be on IPFS and not HTTP, we need to support this correctly.

Some web hosts may not be CORS friendly and our browser may prevent us from getting some files resulting in the lack of metadata to display.

To circumvent this, we use the `/corsProxy` API route that we create on the backend to act as a trusted CORS proxy to access any metadata files on `http`.

