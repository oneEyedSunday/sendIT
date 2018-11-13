/* eslint-disable import/no-extraneous-dependencies */
import http from 'http';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from '../../server';
// import ParcelApiTests from './parcels';
import UsersApiTests from './users';


chai.should();
chai.use(chaiHttp);


export default class SendItTests {
  constructor() {
    this.before();
  }

  before() {
    process.env.NODE_ENV = 'test';
    const port = 8001;
    const { app } = Server.bootstrap();
    app.set('port', port);
    this.server = http.createServer(app);
    this.server.listen(port).on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port elsewhere.`);
      process.exit(-1);
    });

    /*
    setTimeout(() => {

    }, 50);
    */
  }


  runTests() {
    // const parcelTest = new ParcelApiTests(this.token);
    // parcelTest.runTests();
    // parcelTest.after();
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
        console.log(response.body.token);
        this.user = response.body.user;
        const userTest = new UsersApiTests(this.server, this.token);
        userTest.runTests();
        userTest.after();
        this.after();
      })
      .catch(err => console.error(err));
  }

  after() {
    this.server.close();
  }
}
// create a user
// save token

// use token to access API

const tests = new SendItTests();
tests.runTests();
