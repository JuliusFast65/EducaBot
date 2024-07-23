exports.handler = async function(event, context) {
  console.log('Function `getWords` invoked');
  
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from the serverless function!" })
  };
};
