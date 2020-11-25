class HttpError extends Error {
  // alows to run logic within this metod when we instantiate an object
  constructor(message, errorCode) {  
    super(message); // Super to call Error, then add a "message" property
    this.code = errorCode; // Adds a "code" property
  }
}
  
  module.exports = HttpError;