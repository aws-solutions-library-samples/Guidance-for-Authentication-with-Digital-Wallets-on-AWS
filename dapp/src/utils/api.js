import { Auth, API } from 'aws-amplify';

export async function getHttp(path, myInit) {
    // Http API call init parameters
    (!myInit && (myInit = {}));
    // Init header if needed
    (!myInit.headers && (myInit.headers = {}));
    // Inject authorization header
    myInit.headers.Authorization = `Bearer ${(await Auth.currentSession())
        .getIdToken()
        .getJwtToken()}`;

    // We make sure we have an authenticated user with fresh token
    await Auth.currentAuthenticatedUser();

    return API.get(process.env.NEXT_PUBLIC_API_NAME, path, myInit);
}
