class APIResponse {
    constructor(data, statusCode = 200, message = "Success") {
      this.data = data;
      this.statusCode = statusCode;
      this.message = message;
    }
  
    toJSON() {
      return {
        statusCode: this.statusCode,
        message: this.message,
        data: this.data
      };
    }
  }
  
  module.exports = APIResponse;
  