Inspired by this blog: https://davbarrick.medium.com/how-to-build-a-serverless-web3-wallet-login-like-opensea-with-metamask-and-cognito-eb93c723f4de

# Intro

This project demonstrates how to use Amazon Cognito to perform authentication using a crypto wallet and gain credentials to access AWS services.

The authentication process asks the user to sign a message with his private key using his crypto wallet. The signature is validated by Cognito and an ID Token is provided.

The ID Token is then used by API Gateway Authorizer to grant access to restricted API Methods.

The Project also supports unauthenticated users by using Amazon Cognito Identity Pool. 

# Deployment

First go in the `backend` folder, see the README there and deploy the infrastructure using the SAM template. 

Then edit the dapp `.env` file in order to reference the resources created on the backend.
