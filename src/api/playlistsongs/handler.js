/* eslint-disable space-before-function-paren */
const ClientError = require('../../exceptions/ClientError')

class PlaylistsongsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistsongsHandler = this.postPlaylistsongsHandler.bind(this)
    this.getPlaylistsongsHandler = this.getPlaylistsongsHandler.bind(this)
    this.deletePlaylistsongsHandler = this.deletePlaylistsongsHandler.bind(this)
  }

  async postPlaylistsongsHandler(request, h) {
    try {
      this._validator.validatePlaylistsongsPayload(request.payload)
      const { playlistId } = request.params
      const { songId } = request.payload
      console.log(playlistId)
      const playlistsongsId = await this._service.addPlaylistsongs(playlistId, songId)

      const response = h.response({
        status: 'success',
        message: 'Playlist Song berhasil ditambahkan',
        data: {
          playlistsongsId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getPlaylistsongsHandler(request) {
    const { playlistId } = request.params
    const playlists = await this._service.getPlaylistsongById(playlistId)
    return {
      status: 'success',
      data: {
        playlists: playlists.map((pl) => ({
          id: pl.id,
          name: pl.name,
          username: pl.username
        }))
      }
    }
  }

  async deletePlaylistsongsHandler(request, h) {
    try {
      this._validator.validatePlaylistsongsPayload(request.payload)
      const { playlistId } = request.params
      const { songId } = request.payload

      await this._service.deletePlaylistsongs(playlistId, songId)

      return {
        status: 'success',
        message: 'Playlistsong berhasil dihapus'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = PlaylistsongsHandler
