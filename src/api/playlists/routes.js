const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}',
    handler: handler.getPlaylistByIdHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/playlists/{playlistId}',
    handler: handler.putPlaylistByIdHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'musicapp_jwt'
    }
  }
]

module.exports = routes
