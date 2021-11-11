/* eslint-disable camelcase */
exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(100)',
      notNull: true
    },
    song_id: {
      type: 'VARCHAR(100)',
      notNull: true
    }
  })

  pgm.addConstraint('playlistsongs', 'unique_playlistid_and_songid', 'UNIQUE(playlist_id, song_id)')
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.songs_id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropTable('playlistsongs')
}
