/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import http from 'http';
import { Server } from '../../server';


chai.should();
chai.use(chaiHttp);

export class ParcelsApiTests {
  // baseURl = '/api/v1/parcels';
  before() {
    process.env.NODE_ENV = 'test';
    const port = 8080;
    const { app } = Server.bootstrap();
    app.set('port', port);
    this.server = http.createServer(app);
    this.server.listen(port).on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port elsewhere.`);
      process.exit(0);
    });
  }

  after() {
    this.server.close();
  }

  constructor() {
    this.before();
  }

  runTests() {
    describe('Parcels API Tests', () => {
      this.list();
      this.get();
    });
  }

  list() {
    describe('list()', () => {
      it('should list all parcels', () => chai.request(this.server).get('/api/v1/parcels').then((response) => {
        response.should.have.status(200);
        response.body.should.be.a('array');
      }));
    });
  }

  get() {
    describe('get()', () => {
      it('should get a particular parcel delivery order', () => chai.request(this.server).get('/api/v1/parcels/1').then((response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('id').eql(1);
      }));
    });
  }
}

const testSuite = new ParcelsApiTests();
testSuite.runTests();
testSuite.after();
