/**
 * Returns a boolean indicating if a promise was fulilled or not
 */
export const isPromiseFulfilled = (promiseResult) => promiseResult.status == 'fulfilled';

/**
 * Returns a boolean indicating if a promise is rejected or not
 */
export const isPromiseRejected = (promiseResult) => promiseResult.status == 'rejected';

/**
 * Calls Promise.allSettled() on an array of promises and parses the results
 */
export async function promiseAllSettled(promises, onError) {
  const results = await Promise.allSettled(promises);

  const failures = [];
  const successes = [];

  for (const [i, result] of results.entries()) {
    if (isPromiseRejected(result)) {
      const error = new Error(`Promise all settled rejection: ${result.reason}`);
      const failedResult = { ...result, error, i };

      failures.push(failedResult);

      if (onError) {
        onError(failedResult);
      }
    } else if (isPromiseFulfilled(result)) {
      successes.push({ ...result, i });
    }
  }

  return {
    successes,
    failures
  };
}