import { Auth, API } from 'aws-amplify';

export async function getHttp(path, myInit, anonymous = false) {
    (!myInit && (myInit = {}));
    (!myInit.headers && (myInit.headers = {}));

    // All routes are restricted and use the UserPool as authorizer BUT:
    //    * /getNFTsCollectionAlchemy
    // These route uses the AWS_IAM Authorizer
    // The Cognito IdentityPool is used to get temporary AWS Crendetials

    if (!anonymous) {
        // By default we use the token return by the UserPool to authorize access to our API routes. 

        // We make sure we have an authenticated user with fresh session
        await Auth.currentAuthenticatedUser();

        // Inject authorization header
        myInit.headers.Authorization = `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`;
    } else {
        // For anonymous API Calls we are NOT using the UserPool token
        //
        // Instead we ask Cognito for our currentCredentials based on the IAM Role we currently assume
        // Anonymous users assume the CognitoUnAuthorizedRole
        // Authenticated users assume the CognitoAuthorizedRole
        //
        // Both roles grant access to our open route:
        //    * /getNFTsCollectionAlchemy
        //
        // For details about those IAM Roles, see the SAM Template in `backend/template.yaml`
        Auth.currentCredentials()
            .then(d => console.log('data: ', d))
            .catch(e => console.log('error: ', e));
    }

    return API.get(process.env.NEXT_PUBLIC_API_NAME, path, myInit);
}
