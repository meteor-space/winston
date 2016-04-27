const winston = Npm.require('winston');

const WinstonAdapter = Space.Logger.Adapter.extend('Space.Logger.WinstonAdapter', {

  Constructor(transports) {
    const lib = new winston.Logger({
      transports: transports || []
    });
    lib.setLevels(winston.config.syslog.levels);
    this.setLib(lib);
  },

  addTransport() {
    return this._lib.add.apply(this._lib, arguments);
  },

  removeTransport() {
    return this._lib.remove.apply(this._lib, arguments);
  },

  hasTransport(transportName) {
    return this._lib.transports[transportName] !== null;
  },

  setLevel(transportName, levelName) {
    if (!this.hasTransport(transportName)) {
      throw new Error(this.ERRORS.transportNotAdded(transportName));
    }
    this._lib.transports[transportName].level = levelName;
  },

  ERRORS: {
    transportNotAdded(transportName) {
      return `Winston transport with ${transportName} is not added`;
    }
  }
});

WinstonAdapter.console = (options) => {
  const mergedOptions = _.extend({}, {
    colorize: true,
    prettyPrint: true,
    level: 'info'
  }, options);
  return new winston.transports.Console(mergedOptions);
};
