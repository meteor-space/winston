# Space.logging.Winston
**Adds Winston logger(<https://github.com/winstonjs/winston>) adapter for Space.Logger**

Wouldn't be nice to be able to use most of current top-notch logging platforms out with just snap of a finger(or few...)? This is where Winston comes in to play. You can use whatever logging _transport_(storage device) you wish that is currently supported by Winston or many additional - done by community.

Need display something with:

* console? Use: `winston.transports.Console` <https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport>

## Installation
`meteor add space:winston`

*Compatible with `Meteor 1.2.x - 1.3.x`*

## Setup

First, setup your own `Space.Application` or `Space.Module`. Simple example:

```javascript
Space.Application.define('MyApp', {

  configuration: {
    appId: 'MyApp'
    log: {
      enabled: true
    }
  },

  requiredModules: [
    'Space.logging.Winston'
  ],
});
```
And voila! With few lines - you got not only Winston, but also - default `winston.transports.Console` _transport_ configured by default with options like:

```javascript
{
  colorize: true,
  prettyPrint: true,
  level: 'info'
}
```
The key components out here are:

#### Configuration:
```javascript
  configuration: {
    ...
    log: {
      enabled: true
    }
  },
```
Adding `log` object with property `enabled: true` enables logging with our `Space.Logger` provided by `space:base` package.

**Its crucial part, without it - `Space.Logger` no logs shall pass(winky face) through any logs to added libraries(adapters).**

Now on its own `Space.Logger` behaves just like a simple container without filling it up with additional logging libraries using _adapters_.

#### Module:
The heavy lifting of setting up Winston and initializing transports is done here with module:
```javascript
  requiredModules: [
    'Space.logging.Winston'
  ],
```

## Adding new transports

####Configuration:
There are two ways of configuring additional transports. First one - when `Space.logging.Winston` module is initialized by passing additional transports to apps `configuration` object like:

```javascript
Space.Application.define('MyApp', {

  configuration: {
    appId: 'MyApp'
    log: {
      enabled: true,
      winston: {
        transports: [
          new winston.transports.Console({
            colorize: true,
            prettyPrint: true
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
On this example default console transport(`winston.transports.Console`) will be replaced with our own instance configured to our needs.

**Adding any additional transport by `configuration` - will remove default console transport. If you wish to preserve console transport: just add it to  `configuration.log.winston.transports` array.**

####Initialization hooks

By using `Space.Application` or `Space.Module` `onInitialize` hook like this:

```javascript
Space.Application.define('MyApp', {

  configuration: {
    appId: 'MyApp'
    log: {
      enabled: true,
      winston: {
        transports: [
          new winston.transports.Console({
            colorize: true,
            prettyPrint: true
            level: 'debug'
          })
        ]
      }
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
  },

});
```

## Release History
You can find the complete release history in the
[changelog](https://github.com/meteor-space/winston/blob/master/CHANGELOG.md)

## License
Licensed under the MIT license.