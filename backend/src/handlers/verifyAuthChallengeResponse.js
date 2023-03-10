// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

import { ethers } from "ethers";

const headers = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods": "POST",
    'Access-Control-Allow-Origin': "*",
};

export const handler = async (event) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    const signature = event.request.challengeAnswer;
    const address = event.userName.toLowerCase();

    const signing_address = ethers.utils.verifyMessage(event.request.privateChallengeParameters.message, signature)

    if (address === signing_address.toLowerCase()) {
        console.log('Challenge verified!');
        event.response.answerCorrect = true;
    } else {
        console.log('Challenge verification fail!');
        event.response.answerCorrect = false;
    }
    console.log('Return:');
    console.log(event);
    return event;
};