/* eslint-env node, mocha */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import http from 'http';
import { Server } from '../../server';
import { parcelDeliveryOrderTest } from './parcels';


chai.should();
chai.use(chaiHttp);

export default class UsersApiTests {
  before() {
    process.env.NODE_ENV = 'test';
    const port = 8080;
    const { app } = Server.bootstrap();
    app.set('port', port);
    this.server = http.createServer(app);
    this.server.listen(port).on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port elsewhere.`);
      process.exit(-1);
    });
  }

  after() {
    this.server.close();
  }

  constructor() {
    this.before();
    this.baseURI = '/api/v1/users';
  }

  runTests() {
    describe('Users API Tests', () => {
      this.list();
      this.getParcels();
    });
  }

  list() {
    describe('list()', () => {
      it('should list all users', () => chai.request(this.server).get(this.baseURI).then((response) => {
        response.should.have.status(200);
        response.body.should.be.a('array');
      }));
    });
  }

  getParcels() {
    describe('getParcels()', () => {
      it('should return parcel delivery orders belonging to a user', () => chai.request(this.server).get(`${this.baseURI}/1/parcels`).then((response) => {
        response.should.have.status(200);
        response.body.should.be.a('array');
        parcelDeliveryOrderTest(response.body[0], { excludes: ['presentLocation'] });
      }));
    });
  }
}

// TODO (oneeyedsunday)
// separate test environment from prod or dev environment
const testSuite = new UsersApiTests();
testSuite.runTests();
testSuite.after();
