const WinstonAdapter = Space.Logger.Adapter.extend('Space.Logger.WinstonAdapter', {

  Constructor(winston, transports) {
    if (!winston) {
      throw new Error(this.ERRORS.winstonMissing);
    }
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

  hasTransport(name) {
    return this._lib.transports[name] !== null &&
    this._lib.transports[name] !== undefined;
  },

  transport(name) {
    return this._lib.transports[name] || null;
  },

  transports() {
    return this._lib.transports;
  },

  setLevel(transportName, levelName) {
    if (!this.hasTransport(transportName)) {
      throw new Error(this.ERRORS.transportNotFound(transportName));
    }
    this._lib.transports[transportName].level = levelName;
  },

  ERRORS: {
    winstonMissing() {
      return 'Winston library must be provided as first constructor argument';
    },
    transportNotFound(transportName) {
      return `Winston transport with name ${transportName} is not added`;
    }
  }
});
