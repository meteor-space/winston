describe("Space.Logger.WinstonAdapter", () => {

  beforeEach(() => {
    this.winston = {
      config: { syslog: { levels: {} } }
    };
    class Logger {}
    Logger.prototype.setLevels = sinon.stub();
    Logger.prototype.add = sinon.stub();
    Logger.prototype.remove = sinon.stub();
    Logger.prototype.setLevels = sinon.stub();
    Logger.prototype.debug = sinon.stub();
    Logger.prototype.info = sinon.stub();
    Logger.prototype.warning = sinon.stub();
    Logger.prototype.error = sinon.stub();

    this.winston.Logger = sinon.spy(Logger);
  });

  it('extends Space.Logger.LoggingAdapter', () => {
    expect(Space.Logger.WinstonAdapter).to.extend(Space.Logger.LoggingAdapter);
  });

  describe('construction', () => {
    it("takes winston as dependency", () => {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      expect(this.winston.Logger.calledWithNew()).to.be.true;
      expect(adapter.lib()).to.be.instanceOf(this.winston.Logger);
    });

    it("throws an error if winston is not provided", () => {
      const instantiate = () => new Space.Logger.WinstonAdapter();
      expect(instantiate).to.throw(
        Space.Logger.WinstonAdapter.prototype.ERRORS.winstonMissing()
      );
    });

    describe('transports', () => {
      it("can be constructed without transports argument", () => {
        const instantiate = () => new Space.Logger.WinstonAdapter(this.winston);
        expect(instantiate).to.not.throw(Error);
      });

      describe("takes transports", () => {
        it("as empty array", () => {
          const transports = [];
          const adapter = new Space.Logger.WinstonAdapter(
            this.winston, transports
          );
          expect(
            this.winston.Logger.calledWith({ transports: transports })
          ).to.be.true;
        });

        it("as filled array", () => {
          const transports = [{ name: 'console' }, { name: 'file' }];
          const adapter = new Space.Logger.WinstonAdapter(
            this.winston, transports
          );
          expect(
            this.winston.Logger.calledWith({ transports: transports })
          ).to.be.true;
        });
      });

    });
  });

  describe('transports', () => {
    it('adds transport to winston', () => {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      const transport = sinon.spy();
      const options = {};
      adapter.addTransport(transport, options);

      expect(adapter.lib().add).to.be.calledOnce;
      expect(adapter.lib().add).to.be.calledWith(transport, options);
    });

    it('removes transport on winston', () => {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      const transport = sinon.spy();
      adapter.removeTransport(transport);

      expect(adapter.lib().remove).to.be.calledOnce;
      expect(adapter.lib().remove).to.be.calledWith(transport);
    });

    it('checks if transport is added on winston', () => {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      adapter.lib().transports = { console: sinon.spy() };

      expect(adapter.hasTransport('console')).to.be.true;
    });

    it('returns transport from winston', () => {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      const consoleTransport = sinon.spy();
      adapter.lib().transports = { console: consoleTransport };

      expect(adapter.transport('console')).to.be.equal(consoleTransport);
      expect(adapter.transport('file')).to.be.equal(null);
    });

    it('returns transports from winston', () => {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      const transports = { console: sinon.spy };
      adapter.lib().transports = transports;

      expect(adapter.transports()).to.be.equal(transports);
    });

    describe('setting level', () => {
      it('sets level on transport', () => {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        adapter.lib().transports = { console: sinon.spy() };

        adapter.setLevel('console', 5);
        expect(adapter.transport('console').level).to.be.equal(5);
      });

      it('throws error if transport does not exist', () => {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        adapter.lib().transports = {};

        const setLevel = () => adapter.setLevel('console', 5);
        expect(setLevel).to.throw(
          Space.Logger.WinstonAdapter.prototype.ERRORS.transportNotFound(
            'console'
          )
        );
      });
    });
  });

  describe('logging', () => {
    describe('logs message as', () => {
      it("debug", () => {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        const message = 'My log message';
        adapter.debug(message);
        expect(adapter.lib().debug).to.be.calledWithExactly(message);
      });

      it("info", () => {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        const message = 'My log message';
        adapter.info(message);
        expect(adapter.lib().info).to.be.calledWithExactly(message);
      });

      it("warning", () => {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        const message = 'My log message';
        adapter.warning(message);
        expect(adapter.lib().warning).to.be.calledWithExactly(message);
      });

      it("error", () => {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        const message = 'My log message';
        adapter.error(message);
        expect(adapter.lib().error).to.be.calledWithExactly(message);
      });
    });
  });

});
