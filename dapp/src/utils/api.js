// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { Auth, API } from 'aws-amplify';

export async function getHttp(path, myInit, useIAMRole = false) {
  !myInit && (myInit = {});
  !myInit.headers && (myInit.headers = {});

  // All routes use the COGNITO_USER_POOL Authorizer which uses the Cognito User Pool token
  // /getNFTsCollectionAlchemy uses the AWS_IAM Authorizer which uses the IAM Roles and temporary credentials provided by the Cognito IdentityPool

  if (!useIAMRole) {
    // For routes with COGNITO_USER_POOL authorization

    // We make sure we have an authenticated user with fresh session
    await Auth.currentAuthenticatedUser();

    // We Inject an authorization header using our tokens
    myInit.headers.Authorization = `Bearer ${(await Auth.currentSession())
      .getIdToken()
      .getJwtToken()}`;
  } else {
    // For routes with AWS_IAM authorization

    // Using the Amplify Auth library ad Cognito Identity Pool, our user already assume one of two IAM roles automatically
    // Anonymous users assume the CognitoUnAuthorizedRole
    // Authenticated users assume the CognitoAuthorizedRole

    // Both IAM roles grant access to our open route:
    //    * /getNFTsCollectionAlchemy

    // We request temporary AWS credentials
    Auth.currentCredentials()
      .then((d) => console.log("data: ", d))
      .catch((e) => console.log("error: ", e));

    // For details about those IAM Roles, see the SAM Template in `backend/template.yaml`
  }

  // We make a HTTP GET request to our API Gateway
  return API.get(process.env.NEXT_PUBLIC_API_NAME, path, myInit);
}
