const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
    options: {
      auth: 'musicsapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
    options: {
      auth: 'musicsapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getSongByIdHandler,
    options: {
      auth: 'musicsapp_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.putSongByIdHandler,
    options: {
      auth: 'musicsapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteSongByIdHandler,
    options: {
      auth: 'musicsapp_jwt'
    }
  }
]

module.exports = routes
