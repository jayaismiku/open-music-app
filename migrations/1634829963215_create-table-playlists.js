/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('playlists', {
    id: {
      type: 'varchar(50)',
      primaryKey: true
    },
    name: {
      type: 'varchar(150)',
      notNull: true
    },
    owner: {
      type: 'varchar(100)',
      notNull: true
    }
  })

  pgm.addConstraint('playlists', 'unique_owner', 'UNIQUE(owner)')
  pgm.addConstraint('playlists', 'fk_playlists.owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropTable('playlists')
}
