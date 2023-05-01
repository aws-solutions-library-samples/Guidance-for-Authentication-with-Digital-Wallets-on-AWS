// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import fetch from 'node-fetch';

export const handler = async (event) => {
  return new Promise(async (resolve, reject) => {
    let params = event.queryStringParameters;
    let { Host, host, Origin, origin, ...headers } = event.headers;

    console.log(event);
    console.log(`Got request with params:`, params);

    if (!params.url) {
      const errorResponse = {
        statusCode: 400,
        body: "Unable get url from 'url' query parameter",
      };
      reject(Error(errorResponse));
      return;
    }

    const requestParams = Object.entries(params)
      .reduce((acc, param) => {
        if (param[0] !== 'url') acc.push(param.join('='));
        return acc;
      }, [])
      .join('&');

    const url = `${params.url}${requestParams}`;
    const hasBody = /(POST|PUT)/i.test(event.httpMethod);
    try {
      const res = await fetch(url, {
        method: event.httpMethod,
        timeout: 20000,
        body: hasBody ? event.body : null,
        headers,
      });

      let proxyResponse = {
        statusCode: res.status,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
          'content-type': res.headers['content-type'],
        },
      };

      const body = await res.text();
      proxyResponse.body = body;
      resolve(proxyResponse);
    } catch (error) {
      console.error(`Caught error: `, error);

      reject(error);
      return;
    }
  });
};
