/* eslint-disable space-before-function-paren */
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError.js')
const { mapDBToModel } = require('../../utils')

class SongsService {
  constructor(collaborationService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
  }

  async verifyNoteAccess(songId, userId) {
    try {
      await this.verifyNoteOwner(songId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationService.verifyCollaborator(songId, userId)
      } catch {
        throw error
      }
    }
  }

  async verifySongOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM music WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan')
    }

    const song = result.rows[0]
    if (song.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async addSong({ title, year, performer, genre, duration, owner }) {
    const id = 'song-' + nanoid(8)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const query = {
      text: 'INSERT INTO music VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getSongs(owner) {
    const query = {
      // text: 'SELECT * FROM music WHERE owner = $1',
      text: 'SELECT music.* FROM music LEFT JOIN collaborations ON collaborations.song_id = music.id WHERE music.owner = $1 OR collaborations.user_id = $1 GROUP BY music.id',
      values: [owner]
    }
    const result = await this._pool.query(query)

    return result.rows.map(mapDBToModel)
  }

  async getSongById(songId) {
    const query = {
      // text: 'SELECT * FROM music WHERE id = $1',
      text: 'SELECT music.*, users.username FROM music LEFT JOIN users ON users.id = music.owner WHERE music.id = $1',
      values: [songId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan')
    }

    return result.rows.map(mapDBToModel)[0]
  }

  async editSongById(songId, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE music SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM music WHERE id = $1 RETURNING id',
      values: [songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = SongsService
