Package.describe({
  summary: 'Winston logger for Space.Logger',
  name: 'space:winston',
  version: '0.1.0',
  git: 'https://github.com/meteor-space/winston.git',
  documentation: 'README.md'
});

Npm.depends({
  "winston": "2.1.0"
});

Package.onUse(function(api) {

  api.versionsFrom('1.2.0.1');

  api.use([
    'ecmascript',
    'stevezhu:lodash@4.11.1',
    'space:base@4.1.3'
  ]);

  api.addFiles([
    'source/server/module.js',
    'source/server/winston-adapter.js'
  ], 'server');
});
