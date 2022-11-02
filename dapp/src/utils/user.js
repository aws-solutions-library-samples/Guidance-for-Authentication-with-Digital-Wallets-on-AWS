import { Auth } from 'aws-amplify';

export const checkUser = async (setUser) => {
    try {
        const _user = await Auth.currentAuthenticatedUser();
        setUser(_user);
        return _user;
    } catch (err) {
        setUser(null);
        return null;
    }
};

export const handleAmplifySignIn = async address => {
    try {
        const cognitoUser = await Auth.signIn(address);
        console.log("SignIn successful. Proceeding to Custom Auth challenge.");
        return cognitoUser;
    } catch (err) {
        /*Cognito doesn't give us a lot of flexibility on error responses
        so we'll have to string match our 'User Not Found' error here
        and create a cognito user with the address as their username if they don't exist*/
        if (err && err.message && err.message.includes('[404]')) {
            const params = {
                username: address,
                password: getRandomString(30),
            };
            await Auth.signUp(params);
            console.log("SignUp successful");
            return await handleAmplifySignIn(address);
        } else {
            console.log("Signin error");
            throw err;
        }
    }
};

const getRandomString = bytes => {
    const randomValues = new Uint8Array(bytes);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues).map(intToHex).join('');
};

const intToHex = nr => {
    return nr.toString(16).padStart(2, '0');
};