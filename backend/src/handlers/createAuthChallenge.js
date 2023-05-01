// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';

const headers = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods": "POST",
    'Access-Control-Allow-Origin': "*",
};

export const handler = async (event) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    const { request = {} } = event;
    const { userNotFound } = request;

    if (userNotFound) {
        throw new Error('[404] User Not Found');
    }

    const nonce = Math.floor(Math.random() * 1000000).toString();
    const message = `Welcome message, nonce: ${nonce}`;

    event.response.publicChallengeParameters = { message };
    event.response.privateChallengeParameters = { message };

    console.log('Return:');
    console.log(event);
    return event;
};