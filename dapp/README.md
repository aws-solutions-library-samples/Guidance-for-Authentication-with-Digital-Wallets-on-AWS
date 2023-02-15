# NFT Gallery Guide

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



# Default README - NextJS Boilerplate

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
