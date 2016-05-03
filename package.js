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

  api.versionsFrom('1.2.1');

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


Package.onTest(function(api) {

  api.use([
    'ecmascript',
    'space:winston',
    'practicalmeteor:munit@2.1.5',
    'space:testing@3.0.1'
  ]);

  api.add_files([
    'tests/unit/winston-adapter.unit.js',
    'tests/integration/module.integration.js'
  ], 'server');

});
