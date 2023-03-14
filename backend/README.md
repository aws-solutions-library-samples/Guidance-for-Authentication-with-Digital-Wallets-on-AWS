# NFT Gallery - Backend Guide

This folder contains the [SAM](https://aws.amazon.com/serverless/sam/) template (`template.yaml`) which describes all the resources to be deployed on AWS. SAM also packages the code for the [Amazon Lambda functions](https://aws.amazon.com/lambda/) we have in the `src` folder.

# Requirements

You must have the [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed.

You must have an [Alchemy](https://www.alchemy.com/) and [Moralis](https://moralis.io/) account and their respective API keys.

# Deployment

Rename `prod.parameters.example` to `prod.parameters` and add the Alchemy and Moralis keys in order to have access to their API.

Then deploy the backend by running the following commands:

```
sam build
sam sam deploy --on-failure DELETE --parameter-overrides $(cat prod.parameters) --stack-name NFTGallery
```

   * `--parameter-overrides $(cat prod.parameters)` is a way to inject the parameters from a file. SAM only supports parameter overrides in the command line.
   * `--on-failure DELETE` deletes the stack if the deployment fails on CloudFormation. This way you can retry without having to delete the stack by hand yourself.
   * `--stack-name NFTGallery` will be the name of the Cloud Formation stack.

## What does it deploys? 

   * 1 API Gateway
   * 1 Cognito User Pool to collect our identities
   * 1 Cognito Identity Pool to obtain AWS temporary credentials
   * 2 AWS IAM Roles to be used by the Amazon Cognito Identity Pool
   * 2 Lambda functions to serve as API Gateway integrations
   * 4 Lambda functions acting as Cognito Lambda triggers to manage Amazon Cognito authentication challenges
   * 1 S3 Bucket to store the dApp and act as Origin to the CloudFront distribution
   * 1 CloudFront distribution to serve the dApp and front the S3 Bucket

See the `template.yaml` file for more details about all the resources that are created for this architecture.

## What are the API calls?

5 API Gateway routes get created by the template:

   * **/getNFTsCollectionAlchemy**: Get an NFTs Collection from the Alchemy API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`anonymous`)
   * **/getNFTsAlchemy**: Get NFTs from the Alchemy API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`authenticated only`)
   * **/getNFTsMoralis**: Get NFTs from Moralis API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`authenticated only`)
   * **/getNFTsAlchemyLambda**: Get NFTs from Alchemy through API Gateway Lambda proxy integrations (more logics, more customization, higher cost, higher latency) (`authenticated only`)
   * **/getNFTsMoralisLambda**: Get NFTs from Moralis through API Gateway Lambda proxy integrations (more logics, more customization, higher cost, higher latency) (`authenticated only`)
   * **/corsProxy**: Route used to proxy calls to different domains. Useful to retrieve the NFTs' `.json` metadata files from hosts that are not CORS friendly. The dApp calls this route by appending a URL to the `url` query string parameter like this `/corsProxy?url=https://www.google.com`. 10MB max payload (API Gateway limitation) (`public facing`)

**Notes**:

   * **/getNFTsCollectionAlchemy** is accessible to any users, even anonymous users. All other API calls are protected and only available to authenticated users who have received a valid identity and credentials. 
   * **/corsProxy** is used to get the NFT metadata `.json` files if they are not on IPFS.
