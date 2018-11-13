import http from 'http';
import { Server } from '../../server';

export default class TestClass {
  constructor(server = null) {
    if (server === null) {
      this.before();
    } else {
      this.server = server;
    }
  }

  before() {
    process.env.NODE_ENV = 'test';
    const port = 8080;
    const { app } = Server.bootstrap();
    app.set('port', port);
    this.server = http.createServer(app);
    this.server.listen(port).on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port ${port} elsewhere.`);
      process.exit(-1);
    });
  }

  after() {
    this.server.close();
  }
}
