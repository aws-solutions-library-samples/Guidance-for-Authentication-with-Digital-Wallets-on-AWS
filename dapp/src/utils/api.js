import { Auth, API } from 'aws-amplify';

export async function getHttp(path, myInit) {
    const apiName = process.env.NEXT_PUBLIC_API_NAME;

    // Http API call init parameters
    (!myInit && (myInit = {}))
    myInit.headers = {
        Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`
    };

    // We make sure we have an authenticated user with fresh token
    await Auth.currentAuthenticatedUser();

    return API.get(apiName, path, myInit);
}

// export async function getNFTsAlchemy() {
//     const path = '/getNFTsAlchemy';
//     try {
//         const nfts = await getCall(path);
//         console.log(nfts);
//         return nfts;
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }

// export async function getFromLambda() {
//     const path = '/getFromLambda';
//     try {
//         const nfts = await getCall(path);
//         console.log(nfts);
//         return nfts;
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// }

