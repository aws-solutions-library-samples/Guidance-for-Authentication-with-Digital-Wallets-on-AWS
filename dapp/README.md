# NFT Gallery - dApp Guide

This folder contains the code for a decentralized application (dApp) which is a standard single page application (SPA) built using ReactJS, NextJS and TailwindCSS.

It's called a dApp because it connects to the Ethereum blockchain and allows direct interaction with it. In our example we use the Ethereum API to get the user's public Ethereum blockchain address. We will not interact with the Ethereum blockchain directly though, instead we will use Web3 providers such as [Alchemy](https://www.alchemy.com/) and [Moralis](https://moralis.io/). They provide standard HTTP APIs to interact with the blockchain.

# Prerequisites

1. **IMPORTANT**: Make sure to deploy the backend components of the project before testing the dApp.
2. [Node.js](https://nodejs.org/)
3. Node.js package manager. Examples include:
   - [yarn](https://yarnpkg.com/getting-started/install)
   - [npm](https://www.npmjs.com/)
     - npm ships with Node.js and should already be installed if you've installed Node.js
4. An Ethereum-compatible web browser or browser extension. Examples include:
   - [MetaMask Chrome extension](https://metamask.io/)
   - [Brave Browser](https://brave.com/)

# User Authentication and authorization

Any users of the dApp can lookup any NFT collections, even anonymous users. All other operations require users to be authenticated.

Authentication is done using Amazon Cognito User Pool [custom authentication challenge](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html) orchestrated by a series of [AWS Lambda Triggers](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools-working-with-aws-lambda-triggers.html).

The custom challenge consists of asking users to sign a random message using their digital wallet private key.
If the signature is valid, Amazon Cognito will create a new identity in the Cognito User Pool and will return a token.

We use API Gateway to proxy API calls to Alchemy and Moralis. API Gateway provides authorization capabilities and protects our Alchemy and Moralis API Keys. Those secret keys are never exposed on the frontend application. Two authentication methods are supported: Cognito Authorizer and IAM Roles (Using Amazon Cognito IdentityPool)

# Setup your environment

Rename the `.env.example` file to `.env` and update the values there. Some values are referencing backend resources created earlier by SAM (see the `backend` README) and are visibile as output of the `sam deploy` command or in the `Output` tab of the Cloud Formation stack in the [AWS Console](console.aws.amazon.com).

## Install dependencies

Change into the `dapp/` directory:

```
cd dapp
```

To install the project dependencies, run:

```
yarn
```

or

```
npm i
```

## Start the local webserver

To start the local webserver, run:

```
yarn dev
```

or:

```
npm run dev
```

You can now access the dApp on http://localhost:3000/

# Deployment to S3

The SAM template creates a Amazon S3 Bucket and an Amazon CloudFront distribution for us to publish our dApp online. Let's build our dApp and upload it to our Amazon S3 Bucket.

Build the dApp for production by running the below commands. This will build our dApp and place the contents in the `out` directory.

```
yarn build
```

or:

```
npm run build
```

Finally, run to following commands to upload the website code to the Amazon S3 Bucket:

```
cd out
aws s3 sync . s3://${BUCKET_NAME}
```

 - Where `${BUCKET_NAME}` is the name of the Amazon S3 Bucket created by the SAM template.
 - This will upload your static dapp website files from the `out` directory to your Amazon S3 bucket.

_Can't find your bucket name?_
- You can list all your Amazon S3 buckets using the AWS CLI:
   ```
   aws s3 ls
   ```
 - **Note:** If you deployed the stack with the defaults defined by this repo and guide, your bucket name should be prefixed with `nftgallery-webhosts3bucket-`

The website should now be available at the CloudFront endpoint URL (visible in the Outputs tab of your CloudFormation stack).

**Note:** By default, CloudFront caches files for 24 hours. If you upload a new version of your dApp to your Amazon S3 Bucket you'll likely want to invalidate your CloudFront distribution cache so your changes are available immediately. To invalidate the static dapp files in your CloudFront distribution cache, [follow these steps](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html#invalidating-objects-console).

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

Even though NFTs should be on [IPFS](https://ipfs.tech/) and not HTTP, we need to support this correctly as around 50% of NFT assets are still stored on HTTP.

Some web hosts may not be CORS friendly and our browser may prevent us from getting some files resulting in the lack of metadata to display.

To circumvent this, we use the `/corsProxy` API route to act as a trusted CORS proxy domain to access any metadata files on `http`. The Lambda function behind this API route gets the content from the source domain and returns its content. This way the browser never has to interact with untrusted domains thus bypassing CORS all together.
