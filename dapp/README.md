# NFT Gallery - dApp Guide

**IMPORTANT**: Make sure to deploy the backend components of the project before testing the dApp.

This folder contains the code for a decentralized application (dApp) which is a standard single page application (SPA) built using ReactJS, NextJS and TailwindCSS.

It's called a dApp because it connects to the Ethereum blockchain and allows direct interaction with it. In our example we will not interact with Ethereum directly but use Web3 providers APIs such as Alchemy or Moralis. 

Any users can do a NFT collection lookup even anonymous users. All other operations requires the user to be authenticated.

Authentication is done using a custom authentication challenge orchestrated by a series of Amazon Cognito User Pool Lambda triggers.
See: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html

The authentication challenge is the signature of a random message using the user's wallet private key.
If the signature is valid, Amazon Cognito will create a new identity in the Cognito User Pool and will return temporary credentials.

We use API Gateway to proxy calls to Alchemy and Moralis and secure our API Keys on the backend.

# Local deployment 

Rename the `.env.example` file to `.env` and update the values there. Some values reference the backend resources created earlier by SAM (see `backend` README) and are available as output of the `sam deploy` command or in the `Output` tab of the Cloud Formation stack.

To start the local webserver, run:

```
yarn
yarn dev
``` 

You can access the dApp on http://localhost:3000/

# Deployment to S3

The SAM template creates a S3 bucket and an Amazon CloudFront distribution for us to publish our dApp online.

Build the dApp for production by running:

```
yarn build
```

Finally, run to following commands to upload the website code to the S3 Bucket:

```
cd out
aws s3 sync . s3://${BUCKET_NAME}
```

Where `${BUCKET_NAME}` is the name of the S3 bucket created by the SAM template.

The website should now be available at the CloudFront endpoint URL.

# Next.js config

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

# CORS management

Our frontend application needs to get the `.json` metadata files referenced in the NFT tokens on the blockchain. 

Even though NFTs should be on IPFS and not HTTP, we need to support this correctly as around 50% of NFT assets are still stored on HTTP.

Some web hosts may not be CORS friendly and our browser may prevent us from getting some files resulting in the lack of metadata to display.

To circumvent this, we use the `/corsProxy` API route that we create on the backend to act as a trusted CORS proxy to access any metadata files on `http`.

