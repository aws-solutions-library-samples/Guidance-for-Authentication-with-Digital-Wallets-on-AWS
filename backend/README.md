# NFT Gallery Guide

See the `template.yaml` file which contains all the resources to be deployed by SAM.

Rename `prod.parameters.example` to `prod.parameters` and add the Alchemy and Moralis keys in order to have access to their API.

To depoy the backend, run the following commands:

```
sam build
sam sam deploy --on-failure DELETE --parameter-overrides $(cat prod.parameters) --stack-name NFTGallery
```
   * `--parameter-overrides $(cat prod.parameters)` is a way to inject the parameters from a file. Sam only supports parameter overrides in the command line.
   * `--on-failure DELETE` deletes the stack if the deployment fails on CloudFormation. This way you can retry without having to delete the stack by hand yourself.
   * `--stack-name NFTGallery` will be the name of the Cloud Formation stack.

## What does it deploys? 

   * 1 API Gateway
   * 2 Lambdas to serve as API Gateway integrations
   * 4 Lambdas acting as Cognito Lambda triggers to manage Amazon Cognito authentication challenges
   * 1 Cognito User Pool to collect our identities
   * 1 Cognito Identity Pool to obtain AWS temporary credentials
   * 1 S3 Bucket to store the dApp and act as Origin to the CloudFront distribution
   * 1 CloudFront distribution to serve the dApp and front the S3 Bucket
   * 2 AWS IAM Roles to be used by the Amazon Cognito Identity Pool

## What are the API calls?

There are 5 API calls in this example:

   * **/getNFTsCollectionAlchemy**: Get an NFTs Collection from the Alchemy API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`anonymous`)
   * **/getNFTsAlchemy**: Get NFTs from the Alchemy API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`authenticated only`)
   * **/getNFTsMoralis**: Get NFTs from Moralis API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`authenticated only`)
   * **/getNFTsAlchemyLambda**: Get NFTs from Alchemy through API Gateway Lambda proxy integrations (more logics, more customization, higher cost, higher latency) (`authenticated only`)
   * **/getNFTsMoralisLambda**: Get NFTs from Moralis through API Gateway Lambda proxy integrations (more logics, more customization, higher cost, higher latency) (`authenticated only`)
   * **/corsProxy**: Route used to proxy calls to different domains. Useful to retrieve the NFTs' `.json` metadata files from hosts that are not CORS friendly. The dApp calls this route by appending a URL to the `url` query string parameter like this `/corsProxy?url=https://www.google.com`. 10MB max payload (API Gateway limitation) (`public facing`)

*Notes*:

   * **/getNFTsCollectionAlchemy** is accessible to any users, even anonymous users. All other API calls are protected and only available to authenticated users who have received a valid identity and credentials. 
   * **/corsProxy** is used to get the NFT metadata `.json` files if they are not on IPFS. All Images located on other domains will be displayed thanks to the following nextJS configuration (see next.config.js):

