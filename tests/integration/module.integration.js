describe("Space.logging.WinstonAdapter", function() {


  beforeEach(function () {
    this.winston = Npm.require('winston');
    testApp = Space.Application.extend('Test.App', {
      configuration: {},
      requiredModules: ['Space.logging.Winston'],
    });
    this.app = new testApp();
    this.app.start();
  });

  it('adds instance of Space.Logger.WinstonAdapter to instance of Space.Logger', function() {
    const log = this.app.injector.get('log');
    const adapter = log.adapter('winston');

    expect(adapter).to.be.instanceof(Space.Logger.WinstonAdapter);
    expect(adapter.lib()).to.be.instanceof(this.winston.Logger);
  });

  it('maps instance of Space.Logger.WinstonAdapter to Injector', function() {
    expect(
      this.app.injector.get('Space.Logger.WinstonAdapter')
    ).to.be.instanceof(Space.Logger.WinstonAdapter);
  });

  describe('configuration', function () {
    describe('transports', function () {
      it('uses default winston.transports.Console when transports are not configured', function() {
        const logger = this.app.injector.get('log');
        const adapter = logger.adapter('winston');

        expect(adapter.hasTransport('console')).to.be.true;
      });

      it('overrides transports configuration', function() {
        const options = {
          colorize: false,
          json: true,
          level: 'error'
        }
        const testApp = Space.Application.extend('Test.App', {
          configuration: {
            log: {
              enabled: true,
              winston: {
                transports: [new this.winston.transports.Console(options)]
              }
            }
          },
          requiredModules: ['Space.logging.Winston'],
        });
        const app = new testApp();
        app.start();

        const log = app.injector.get('log');
        const adapter = log.adapter('winston');
        const consoleTransport = adapter.transport('console');

        expect(consoleTransport).to.include(options);
      });
    });
  });

});