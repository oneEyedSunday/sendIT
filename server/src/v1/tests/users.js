/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import http from 'http';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';
import dotenv from 'dotenv';
import { bootstrap } from '../../server';
import errorCodesAndMessages from '../helpers/errors';

const { authRequired, accessDenied, resourceNotExists } = errorCodesAndMessages;

dotenv.config();
chai.should();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';
const port = 8081;
const { app } = bootstrap();
app.set('port', port);
const server = http.createServer(app);
server.listen(port).on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port ${port} elsewhere.`);
  process.exit(-1);
});

/**
 * User Api tests - All tests for the user endpont
 * @module tests/users
 */
export default class UsersApiTests {
  /**
   * @function constructor
   * @memberof module:users
   * @param {object} host - URL of server
   * @returns {null} No return
   */
  constructor(host = null) {
    this.server = host;
    this.baseURI = '/api/v1/users';
  }

  /**
 * runTests - run all tests specified
 *
 * @function runTests
 * @memberof  module:users
 * @return {null} No return
*/
  runTests() {
    describe('Users API Tests', () => {
      before((done) => {
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            email: `${Date.now()}@yahoo.com`,
            password: 'finito',
            firstname: 'Pier',
            lastname: 'Dragowski',
          })
          .then((response) => {
            this.token = response.body.token;
            this.tokenUser = jwt.verify(this.token, process.env.secret);
            this.adminUUID = uuid();
            this.mockAdminToken = jwt.sign({
              id: this.adminUUID,
              admin: true,
            }, process.env.secret);
            done();
          })
          .catch(err => console.error(err));
      });
      this.listUsers();
      this.getUserParcels();

      after(() => {
        server.close();
      });
    });
  }

  /**
 * listUsers - a test to ensure listing users is running as expected
 *
 * @function listUsers
 * @memberof  module:parcel
 * @return {null} No return
*/
  listUsers() {
    describe(`GET ${this.baseURI}`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .get(this.baseURI)
        .then((response) => {
          response.should.have.status(authRequired.status);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql(authRequired.message);
        }));

      it('it should list all users', () => chai.request(this.server)
        .get(this.baseURI)
        .set('Authorization', `Bearer ${this.mockAdminToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
        }));
    });
  }

  /**
 * getUserParcels - a test to ensure getting a user parcels works as expected
 *
 * @function getUserParcels
 * @memberof  module:users
 * @return {null} No return
*/
  getUserParcels() {
    describe(`GET ${this.baseURI}/<userId>/parcels`, () => {
      before((done) => {
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            email: `${Date.now()}@test.com`,
            password: 'finito',
            firstname: 'Test',
            lastname: 'Test',
          })
          .then((response) => {
            this.allowedUserToken = response.body.token;
            jwt.verify(this.allowedUserToken, process.env.secret, (err, decoded) => {
              this.userOwningParcel = decoded;
              server.close();
              server.listen(port);
              chai.request(this.server)
                .post('/api/v1/parcels')
                .send({
                  userId: this.userOwningParcel.id,
                  destination: 'Some Place',
                  pickUpLocation: 'Some pickup',
                })
                .set('Authorization', this.allowedUserToken)
                .then((createParcelResponse) => {
                  this.parcel = createParcelResponse.body;
                  done();
                })
                .catch(createParcelError => console.error('createParcelError', createParcelError));
            });
          })
          .catch(err => console.error('User Sign up error ', err));
      });
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .get(this.baseURI)
        .then((response) => {
          response.should.have.status(authRequired.status);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql(authRequired.message);
        }));

      it('it should not return all parcel delivery orders belonging to a user if accessed by a different user', () => chai.request(this.server)
        .get(`${this.baseURI}/1/parcels`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(accessDenied.status);
          response.should.be.an('object');
          response.body.should.have.property('error');
          response.body.should.have.property('error').eql(accessDenied.message);
        }));

      it('it should return all parcel delivery orders belonging to a user if accessed by an admin', () => chai.request(this.server)
        .get(`${this.baseURI}/${this.userOwningParcel.id}/parcels`)
        .set('Authorization', `Bearer ${this.mockAdminToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('destination');
          response.body[0].should.have.property('price');
          response.body[0].should.have.property('status');
        }));

      it('it should return all parcel delivery orders belonging to a user if accessed by user', () => chai.request(this.server)
        .get(`${this.baseURI}/${this.userOwningParcel.id}/parcels`)
        .set('Authorization', `Bearer ${this.allowedUserToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('destination');
          response.body[0].should.have.property('price');
          response.body[0].should.have.property('status');
        }));

      it('it should return an error if user is not found', () => chai.request(this.server)
        .get(`${this.baseURI}/99999999/parcels`)
        .set('Authorization', `Bearer ${this.mockAdminToken}`)
        .then((response) => {
          response.should.have.status(resourceNotExists.status);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eql(`User ${resourceNotExists.message}`);
        }));

      it('it should return an empty array if User has no parcel delivery orders.', () => chai.request(this.server)
        .get(`${this.baseURI}/${this.tokenUser.id}/parcels`)
        .set('Authorization', `Bearer ${this.mockAdminToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(0);
        }));
    });
  }
}
new UsersApiTests(`http://localhost:${port}`).runTests();
