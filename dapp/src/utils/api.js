import { Auth, API } from 'aws-amplify';

export async function getHttp(path, myInit, useIAMRole = false) {
    (!myInit && (myInit = {}));
    (!myInit.headers && (myInit.headers = {}));

    /* 
       All routes use COGNITO_USER_POOL as authorizer BUT /getNFTsCollectionAlchemy
       This route uses the AWS_IAM Authorizer in which case the Cognito IdentityPool is used to get temporary AWS Crendetials 
    */
    
    if (!useIAMRole) {
        // For API routes with COGNITO_USER_POOL authorization 

        // We make sure we have an authenticated user with fresh session
        await Auth.currentAuthenticatedUser();

        // We Inject an authorization header using our tokens
        myInit.headers.Authorization = `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`;
    } else {
        // For API routes with AWS_IAM authorization 

        // Anonymous users assume the CognitoUnAuthorizedRole
        // Authenticated users assume the CognitoAuthorizedRole
        
        // Both roles grant access to our open route:
        //    * /getNFTsCollectionAlchemy
        
        // We request temporary AWS credentials based on the IAM Role we assume
        Auth.currentCredentials()
            .then(d => console.log('data: ', d))
            .catch(e => console.log('error: ', e));

        // For details about those IAM Roles, see the SAM Template in `backend/template.yaml`
    }

    return API.get(process.env.NEXT_PUBLIC_API_NAME, path, myInit);
}
