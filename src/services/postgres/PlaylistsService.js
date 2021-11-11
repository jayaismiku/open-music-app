/* eslint-disable space-before-function-paren */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
// const { mapDBToModel } = require('../../utils/playlists')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError.js')

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
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

  async addPlaylists({ name, owner }) {
    const id = 'playlist-' + nanoid(8)

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylists(owner) {
    const query = {
      // text: 'SELECT * FROM playlists WHERE owner = $1',
      // text: 'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1 OR users.id = $1 GROUP BY playlists.id',
      text: 'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1',
      values: [owner]
    }
    const result = await this._pool.query(query)

    return result.rows
  }

  async getPlaylistsById(playlistId) {
    const query = {
      // text: 'SELECT * FROM playlists WHERE id = $1',
      text: 'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON users.id = playlists.owner WHERE playlists.id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    return result.rows
  }

  async editPlaylistById(playlistId, { name, owner }) {
    // const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE playlists SET name = $1, owner = $2 WHERE id = $3 RETURNING id',
      values: [name, owner, playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
    }
  }

  async deletePlaylistById(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = PlaylistsService
