const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/notes',
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'musicapp_jwt',
    },
  },
];

module.exports = routes;
