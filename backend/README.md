# NFT Gallery - Backend Guide

This folder contains the [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/) template (`template.yaml`) which describes all the resources to be deployed on AWS. SAM also packages the code for the [AWS Lambda functions](https://aws.amazon.com/lambda/) we have in the `src` folder.

# Requirements

1. AWS Account with proper IAM permissions in order to deploy the AWS resources listed in the `template.yaml` file.
   - Don't have an AWS account? [Get started for free](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html).
2. AWS Serverless Application Model (SAM).
   - [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) is a toolkit for building, testing, running and deploying serverless applications on AWS. It is compatible with [AWS CloudFormation](https://aws.amazon.com/cloudformation/). SAM generates a CloudFormation template and deploys it.
   - Ensure you have completed the [AWS SAM prerequistes](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/prerequisites.html).
   - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).
3. [Alchemy](https://www.alchemy.com/) and [Moralis](https://moralis.io/) accounts and API keys.
   - This project uses Alchemy and Moralis to fetch data from the blockchain.
   - Accounts and API Keys for those accounts are required and used throughout this project.

# Deployment

Once you have your AWS account, the AWS SAM CLI setup, and Alchemy and Moralis API keys, we can get started.

## Environment Setup

Rename the `prod.parameters.example` to `prod.parameters` and add the Alchemy and Moralis keys (in the place of the `xxXxx`) to give access to their API keys to your SAM template.

In the next step, we'll use AWS SAM to deploy our infrastructure using the values defined in `prod.parameters`.

## Deploy your backend infrastructure

Deploy the backend by running the following commands:

```
cd backend
sam build
sam deploy --guided --stack-name NFTGallery --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --on-failure DELETE --parameter-overrides $(cat prod.parameters) --confirm-changeset
```

- `cd backend`
  - Change into the `backend/` directory where the SAM `template.yaml` file is located.
- `sam build`
  - Prepare your backend for deployment.
  - **Important:** This command will need to be ran again to deploy any changes to the SAM template or Lambda function source code.
- `sam deploy`
  - Deploy the SAM template. More details in the [AWS SAM documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-deploy.html).
  - `--guided` guides you through the deployment and generates a `samconfig.toml` file for subsequent deployments.
  - `--stack-name NFTGallery` sets the name of the Cloud Formation stack.
  - `--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM` allows CloudFormation to create our AWS IAM resources.
  - `--on-failure DELETE` deletes the stack if the first CloudFormation deployment fails. This way you can retry without having to delete the stack by hand yourself.
  - `--parameter-overrides $(cat prod.parameters)` is a way to inject the template parameters from a file. SAM only supports parameter overrides in the command line.
  - `--confirm-changeset` prompts you to confirm deployment.

**Note:** 
   
   * After your first deployment you can run the `sam deploy` command without any of the flags to deploy the same CloudFormation stack. To make changes, run the `sam deploy --guided` command again or update the generated `samconfig.toml` file directly.
   * You may want to save the `Outputs` values displayed at the end of the `sam deploy` command. These values will be used in the `dapp` setup steps. See `projectRoot/dapp/README.md`.

## What does it deploy?

- 1 API Gateway
- 1 Cognito User Pool to collect our user identities
- 1 Cognito Identity Pool to obtain temporary AWS credentials
- 2 AWS IAM Roles to be used by the Amazon Cognito Identity Pool
- 2 Lambda functions to serve as API Gateway integrations
- 4 Lambda functions acting as Cognito Lambda triggers to manage Amazon Cognito authentication challenges
- 1 S3 Bucket to store the dApp and act as Origin to the CloudFront distribution
- 1 CloudFront distribution to serve the dApp and front the S3 Bucket

See the `template.yaml` file for more details about all the resources that are created for this architecture.

## What are the API calls?

5 API Gateway routes get created by the SAM template:

- **/getNFTsCollectionAlchemy**: Get an NFTs Collection from the Alchemy API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`anonymous`)
- **/getNFTsAlchemy**: Get NFTs from the Alchemy API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`authenticated only`)
- **/getNFTsMoralis**: Get NFTs from Moralis API through API Gateway HTTP proxy (no lambda, low latency, low cost) (`authenticated only`)
- **/getNFTsAlchemyLambda**: Get NFTs from Alchemy through API Gateway Lambda proxy integrations (more logics, more customization, higher cost, higher latency) (`authenticated only`)
- **/getNFTsMoralisLambda**: Get NFTs from Moralis through API Gateway Lambda proxy integrations (more logics, more customization, higher cost, higher latency) (`authenticated only`)
- **/corsProxy**: Route used to proxy calls to different domains. Useful to retrieve the NFTs' `.json` metadata files from hosts that are not CORS friendly. The dApp calls this route by appending a URL to the `url` query string parameter like this `/corsProxy?url=https://www.google.com`. 10MB max payload (API Gateway limitation) (`public facing`)

**Notes**:

- **/getNFTsCollectionAlchemy** is accessible to any users, even anonymous users. All other API calls are protected and only available to authenticated users who have an identity and valid credentials.
- **/corsProxy** is used to get the NFT metadata `.json` files if they are not on IPFS and prevent CORS errors for misconfigured backends.
