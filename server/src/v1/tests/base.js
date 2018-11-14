/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';


import http from 'http';
import { Server } from '../../server';

chai.use(chaiHttp);

export default class TestClass {
  constructor(server = null) {
    console.log('Base constructor');
    if (server === null) {
      this.before();
      if (!this.token) this.getToken();
    } else {
      this.server = server;
    }
  }

  before() {
    console.log('Running Before');
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

  getToken() {
    chai.request(this.server)
      .post('/api/v1/auth/signup')
      .send({
        user: {
          email: 'test@test.com',
          firstname: 'test',
          lastname: 'test',
          password: 'test123',
        },
      })
      .then((response) => {
        this.token = response.body.token;
        this.user = response.body.user;
      })
      .catch(err => console.error(err));
  }

  after() {
    this.server.close();
  }
}
