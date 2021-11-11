const { PlaylistsPayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const PlaylistsValidator = {
  validatePlaylistsPayload: (payload) => {
    const validationResult = PlaylistsPayloadSchema.validate(payload)
    if (validationResult.error) {
      // throw new Error(validationResult.error.message);
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = PlaylistsValidator
