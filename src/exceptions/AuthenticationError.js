/* eslint-disable space-before-function-paren */
const ClientError = require('./ClientError')

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}

module.exports = AuthenticationError
