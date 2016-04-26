const winston = Npm.require('winston');

const WinstonAdapter = Space.Logger.Adapter.extend('Space.Logger.WinstonAdapter', {

  Constructor: function(transports) {
    let lib = new winston.Logger({
      transports: transports || []
    });
    lib.setLevels(winston.config.syslog.levels);
    this.setLib(lib);
  },

  addTransport: function() {
    return this._lib.add.apply(this._lib, arguments);
  },

  removeTransport: function() {
    return this._lib.remove.apply(this._lib, arguments);
  },

  hasTransport: function(name) {
    return this._lib.transports[transportName] != null;
  },

  setMinLevel: function(transportName, levelName) {
    if (!this.hasTransport(transportName)) {
      throw new Error(this.ERRORS.transportNotAdded(transportName));
    }
    return this._lib.transports[transportName].level = levelName;
  },

  ERRORS: {
    transportNotAdded: function(transportName) {
      return `Winston transport with ${transportName} is not added`;
    }
  }
});

WinstonAdapter.console = function(options) {
  if (options == null) {
    let options = {
      colorize: true,
      prettyPrint: true,
      level: 'info'
    };
  }
  return new winston.transports.Console(options);
};
