export function respondToError(error, message = 'Something went wrong') {
  console.error(message, error);
  alert(`${message}...\n` + error?.message);
}