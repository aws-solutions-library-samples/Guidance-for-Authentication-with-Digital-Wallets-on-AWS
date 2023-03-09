# NFT Gallery dApp Guide

**Important**: Make sure to deploy the backend components of the project before testing the dApp.

This is a single page application (SPA) build using ReactJS, NextJS and TailwindCSS.

The app connects to API Gateway to retrieve NFTs from Web3 providers such as Alchemy or Moralis. 
It resolves IPFS and HTTP URIs to get NFT metadata files and assets and displays details about the NFTs on the screen. 

Any users can do a NFT collection lookup even anonymous users. All other operations requires the user to be authenticated.

Authentication is done using a custom authentication challenge orchestrated by a series of Amazon Cognito User Pool Lambda triggers.
See: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html

The authentication challenge is the signature of a random message using the user's wallet private key.
If the signature is valid, Amazon Cognito will create a new identity in the Cognito User Pool and will return temporary credentials.

# Local deployment 

Rename the `.env.example` file to `.env` and update the values there. Some values reference the backend resources created earlier by SAM (see `backend` README) and are available as output of the `sam deploy` command or in the `Output` tab of the Cloud Formation stack.

Then run `yarn` and `yarn dev` to start the local webserver.

You can access the dApp on http://localhost:3000/

# Deployment to S3

The backend SAM template created a S3 bucket and a CloudFront distribution for us to publish our dApp.

First we need to build the dApp for production. Run: 

```
yarn build
```

This command will build our dApp for production and will export production ready files to the `out` folder.

Run to following to upload the website code to the S3 Bucket:

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

