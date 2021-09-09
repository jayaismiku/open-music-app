const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }
}

module.exports = NotesService;
