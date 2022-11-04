Inspired by blog: https://davbarrick.medium.com/how-to-build-a-serverless-web3-wallet-login-like-opensea-with-metamask-and-cognito-eb93c723f4de

# Intro

This project demonstrate how to use Cognito to perform web3 authentication and gain credentials to access AWS services.

The authentication process asks the user to sign a message on the blockchain. The signature is validated by Cognito and an ID Token is provided.

The ID Token is then used by API Gateway Authorizer to grant access to restricted API Methods.

The Project also supports unauthenticated anonymous users. Anonymous users get an IAM role that allows them to access public, non restricted API methods.

# Deployment

First do in the `backend` folder and deploy the infrstatructe using the SAM template.
See the README.

Then edit the dapp .env file in order to reference the resources created on the backend.
