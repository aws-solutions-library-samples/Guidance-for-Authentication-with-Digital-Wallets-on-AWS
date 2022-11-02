'use strict';

const headers = {
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods": "POST",
    'Access-Control-Allow-Origin': "*",
};

export const handler = async (event) => {
    console.log('Event: ', JSON.stringify(event, null, 2));

    event.response.autoConfirmUser = true;

    console.log('Return:');
    console.log(event);
    return event;
};