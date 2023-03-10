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

    if (
        event.request.session &&
        event.request.session.find(attempt => attempt.challengeName !== 'CUSTOM_CHALLENGE')
    ) {
        console.log('incorrect');
        // We only accept custom challenges; fail auth
        event.response.issueTokens = false;
        event.response.failAuthentication = true;
    } else if (
        event.request.session &&
        event.request.session.length &&
        event.request.session.slice(-1)[0].challengeName === 'CUSTOM_CHALLENGE' &&
        event.request.session.slice(-1)[0].challengeResult === true
    ) {
        console.log('correct signature');
        // The user provided the correct signature; succeed auth
        event.response.issueTokens = true;
        event.response.failAuthentication = false;
    } else {
        console.log('incorrect signature');
        // The user did not provide a correct signature; present challenge
        event.response.issueTokens = false;
        event.response.failAuthentication = false;
        event.response.challengeName = 'CUSTOM_CHALLENGE';
    }

    console.log('Return:');
    console.log(event);
    return event;
};