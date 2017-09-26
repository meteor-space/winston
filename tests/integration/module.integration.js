describe("Space.logging.WinstonAdapter", () => {

  beforeEach(() => {
    this.winston = Npm.require('winston');
    const TestApp = Space.Application.extend('Test.App', {
      configuration: {},
      requiredModules: ['Space.logging.Winston']
    });
    this.app = new TestApp();
    this.app.start();
  });

  it('adds instance of Space.Logger.WinstonAdapter to instance of Space.Logger', () => {
    const log = this.app.injector.get('log');
    const adapter = log.adapter('winston');

    expect(adapter).to.be.instanceof(Space.Logger.WinstonAdapter);
    expect(adapter.lib()).to.be.instanceof(this.winston.Logger);
  });

  it('maps instance of Space.Logger.WinstonAdapter to Injector', () => {
    expect(
      this.app.injector.get('Space.Logger.WinstonAdapter')
    ).to.be.instanceof(Space.Logger.WinstonAdapter);
  });

  describe('configuration', () => {
    describe('transports', () => {
      it('uses default winston.transports.Console when transports are not configured', () => {
        const logger = this.app.injector.get('log');
        const adapter = logger.adapter('winston');

        expect(adapter.hasTransport('console')).to.be.true;
      });

      it('overrides transports configuration', () => {
        const options = {
          colorize: false,
          json: true,
          level: 'error'
        };
        const TestApp = Space.Application.extend('Test.App', {
          configuration: {
            log: {
              enabled: true,
              winston: {
                transports: [new this.winston.transports.Console(options)]
              }
            }
          },
          requiredModules: ['Space.logging.Winston']
        });
        const app = new TestApp();
        app.start();

        const log = app.injector.get('log');
        const adapter = log.adapter('winston');
        const consoleTransport = adapter.transport('console');

        expect(consoleTransport).to.include(options);
      });
    });
  });

});
