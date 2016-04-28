describe("Space.Logger.WinstonAdapter", function() {

  beforeEach(function () {
    this.winston = {
      config: {syslog: {levels: {} }}
    };

    class Logger {};
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

  it('extends Space.Logger.Adapter', function() {
    expect(Space.Logger.WinstonAdapter).to.extend(Space.Logger.Adapter);
  });

  describe('construction', function () {
    it("takes winston as dependency", function() {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      expect(this.winston.Logger.calledWithNew()).to.be.true;
      expect(adapter.lib()).to.be.instanceOf(this.winston.Logger);
    });

    it("throws an error if winston is not provided", function() {
      const instantiate = function() {
        new Space.Logger.WinstonAdapter()
      };
      expect(instantiate).to.throw(
        Space.Logger.WinstonAdapter.prototype.ERRORS.winstonMissing()
      );
    });

    describe('transports', function () {
      it("can be constructed without transports argument", function() {
        instantiate = () => {
          new Space.Logger.WinstonAdapter(this.winston);
        };
        expect(instantiate).to.not.throw(Error);
      });

      describe("takes transports", function () {
        it("as empty array", function() {
          const transports = [];
          const adapter = new Space.Logger.WinstonAdapter(
            this.winston, transports
          );
          expect(
            this.winston.Logger.calledWith({transports: transports})
          ).to.be.true;
        });

        it("as filled array", function() {
          const transports = [{name: 'console'}, {name: 'file'}];
          const adapter = new Space.Logger.WinstonAdapter(
            this.winston, transports
          );
          expect(
            this.winston.Logger.calledWith({transports: transports})
          ).to.be.true;
        });
      });

    });
  });

  describe('transports', function () {
    it('adds transport to winston', function() {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);

      const transport = sinon.spy();
      const options = {};
      adapter.addTransport(transport, options);

      expect(adapter.lib().add).to.be.calledOnce;
      expect(adapter.lib().add).to.be.calledWith(transport, options);
    });

    it('removes transport on winston', function() {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);

      const transport = sinon.spy();
      adapter.removeTransport(transport);

      expect(adapter.lib().remove).to.be.calledOnce;
      expect(adapter.lib().remove).to.be.calledWith(transport);
    });

    it('checks if transport is added on winston', function() {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      adapter.lib().transports = {console: sinon.spy()}

      expect(adapter.hasTransport('console')).to.be.true;
    });

    it('returns transport from winston', function() {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      const consoleTransport = sinon.spy()
      adapter.lib().transports = {console: consoleTransport};

      expect(adapter.transport('console')).to.be.equal(consoleTransport);
      expect(adapter.transport('file')).to.be.equal(null);
    });

    it('returns transports from winston', function() {
      const adapter = new Space.Logger.WinstonAdapter(this.winston);
      const transports = {console: sinon.spy}
      adapter.lib().transports = transports;

      expect(adapter.transports()).to.be.equal(transports);
    });

    describe('setting level', function () {
      it('sets level on transport', function () {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        adapter.lib().transports = {console: sinon.spy()}

        adapter.setLevel('console', 5)
        expect(adapter.transport('console').level).to.be.equal(5);
      });

      it('throws error if transport does not exist', function () {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        adapter.lib().transports = {}

        setLevel = function() {
          adapter.setLevel('console', 5)
        };
        expect(setLevel).to.throw(
          Space.Logger.WinstonAdapter.prototype.ERRORS.transportNotFound(
            'console'
          )
        );
      });
    });
  });

  describe('logging', function () {
    describe('logs message as', function () {
      it("debug", function() {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        let message = 'My log message';
        adapter.debug(message);
        expect(adapter.lib().debug).to.be.calledWithExactly(message);
      });

      it("info", function() {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        let message = 'My log message';
        adapter.info(message);
        expect(adapter.lib().info).to.be.calledWithExactly(message);
      });

      it("warning", function() {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        let message = 'My log message';
        adapter.warning(message);
        expect(adapter.lib().warning).to.be.calledWithExactly(message);
      });

      it("error", function() {
        const adapter = new Space.Logger.WinstonAdapter(this.winston);
        let message = 'My log message';
        adapter.error(message);
        expect(adapter.lib().error).to.be.calledWithExactly(message);
      });
    });
  });

});
