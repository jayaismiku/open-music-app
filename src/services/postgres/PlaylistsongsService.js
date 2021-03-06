/* eslint-disable space-before-function-paren */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
// const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const ClientError = require('../../exceptions/ClientError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsongsService {
  constructor() {
    this._pool = new Pool()
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const playlist = result.rows[0]

    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }

  async addPlaylistsongs(playlistId, songId) {
    const id = `playlistsong-${nanoid(8)}`
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new AuthorizationError('Playlistsongs gagal ditambahkan')
    }
    return result.rows[0].id
  }

  async getPlaylistsongById(playlistId) {
    const query = {
      // text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1',
      text: 'SELECT songs.* FROM songs LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id WHERE playlistsongs.playlist_id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    return result.rows
  }

  async deletePlaylistsongs(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new ClientError('Playlistsongs gagal dihapus')
    }
  }
}

module.exports = PlaylistsongsService
