# space:winston [![Circle CI](https://circleci.com/gh/meteor-space/winston.svg?style=svg)](https://circleci.com/gh/meteor-space/winston)

**A production-grade logging adapter for [Space](http://www.github.com/meteor-space)**

This package adds a custom [Winston](https://github.com/winstonjs/winston) logger instance, that can be configured with your [Transport](https://github.com/winstonjs/winston/blob/master/docs/transports.md) of your choice via Space.Module configuration or dynamically using a simple API. It also sets up a [winston.transports.Console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport) transport to log `info` messages if no custom transports are provided.

##Why winston?

Winston is a powerful library, and has a vibrant ecosystem with core and community driven extensions including support for most logging services:

> Winston is designed to be a simple and universal logging library with support for multiple transports. A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file.

>There also seemed to be a lot of logging libraries out there that coupled their implementation of logging (i.e. how the logs are stored / indexed) to the API that they exposed to the programmer. This library aims to decouple those parts of the process to make it more flexible and extensible.

## Installation
`meteor add space:winston`

*Compatible with `Meteor 1.2.x - 1.3.x`*

## Setup

First, define the following configuration options your app's module configuration:

```javascript
Space.Application.define('MyApp', {

  configuration: {
    appId: 'MyApp'
    log: {
      enabled: true // global switch to enable or disable logging
    }
  },

  requiredModules: [
    'Space.logging.Winston'
  ],
});
```
And voila! This has enabled logging with the [built-in winston.transports.Console transport](source/server/winston-adaptor.js#L39), logging the `info` level and up.

The purpose of this default is to provide a fast way to get going, but you may wish to have more control, such as what level logs to the console. This is achieved by defining your own transport, which gives you full control.

## Custom transports

### Using Module Configuration
Explicitly define an array of transports to suit your requirements

_To preserve the default console transport use the `addTransport` method instead_

```javascript
const winston = Npm.require('winston');

Space.Application.define('MyApp', {

  configuration: {
    appId: 'MyApp'
    log: {
      enabled: true,
      winston: {
        transports: [
          new winston.transports.Console({
            colorize: true,
            prettyPrint: true,
            level: 'debug'
          })
        ]
      }
    }
  }
  requiredModules: [
    'Space.logging.Winston'
  ],
});
```

#### adaptor.addTransport(transportClass, config)
The example below uses a module lifecycle hook to _add_ a transport, preserving the default. This provides the most flexibility, including dynamic config based on the environment.

```javascript
Space.Application.define('MyApp', {

  configuration: {
    appId: 'MyApp'
    log: {
      enabled: true
    }
  }
  
  requiredModules: [
    'Space.logging.Winston'
  ],

  onInitialize() {
    let winstonAdapter = this.injector.get('Space.Logger.WinstonAdapter');
    winstonAdapter.addTransport(winston.transports.Console, {
      name: 'yet-another-console-transport',
      colorize: false,
      prettyPrint: false,
      level: 'debug'
    });
  }

});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
- Add unit / integration tests for any new or changed functionality.
- We use [git-flow](https://github.com/nvie/gitflow) so always branch from and target _develop_, which is the upcoming release of the package.

[git-flow Cheat Sheet](http://danielkummer.github.io/git-flow-cheatsheet/)
[A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)

## Run the tests
`./test.sh`

## Release History
You can find the complete release history in the
[changelog](https://github.com/meteor-space/winston/blob/master/CHANGELOG.md)

## License
Licensed under the MIT license.