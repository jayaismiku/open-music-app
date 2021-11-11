/* eslint-disable space-before-function-paren */
const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.getPlaylistByIdHandler = this.getPlaylistByIdHandler.bind(this)
    this.putPlaylistByIdHandler = this.putPlaylistByIdHandler.bind(this)
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistsPayload(request.payload)
      const { name = 'untitled' } = request.payload
      const { id: credentialId } = request.auth.credentials

      const playlistId = await this._service.addPlaylists({ name, owner: credentialId })
      // const playlistId = await this._service.addPlaylists({ name, owner })

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId
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

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._service.getPlaylists(credentialId)
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

  async getPlaylistByIdHandler(request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      // await this._service.verifyPlaylistOwner(playlistId, credentialId)
      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      const playlist = await this._service.getPlaylistsById(playlistId)
      return {
        status: 'success',
        data: {
          playlist
        }
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

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async putPlaylistByIdHandler(request, h) {
    try {
      this._validator.validatePlaylistsPayload(request.payload)
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistOwner(playlistId, credentialId)
      await this._service.verifyPlaylistAccess(playlistId, credentialId)
      await this._service.editPlaylistById(playlistId, request.payload)
      return {
        status: 'success',
        message: 'playlist berhasil diperbarui'
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

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials
      await this._service.verifyPlaylistOwner(playlistId, credentialId)
      await this._service.deletePlaylistById(playlistId)
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus'
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

module.exports = PlaylistsHandler
