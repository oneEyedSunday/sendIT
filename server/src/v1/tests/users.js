/* eslint-env node, mocha */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import BaseApiTestClass from './base';
import { parcelDeliveryOrderTest } from './parcels';


chai.should();
chai.use(chaiHttp);

export default class UsersApiTests extends BaseApiTestClass {
  constructor(server = null, token = null) {
    super(server);
    this.baseURI = '/api/v1/users';
    if (token) this.token = token;
    // this.prep();
    // this.runTests();
  }

  prep() {
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

  runTests() {
    describe('Users API Tests', () => {
      this.list();
      this.getUserParcels();
    });
  }

  list() {
    describe(`GET ${this.baseURI}`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .get(this.baseURI)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should list all users', () => chai.request(this.server)
        .get(this.baseURI)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(3);
        }));
    });
  }

  getUserParcels() {
    describe(`GET ${this.baseURI}/1/parcels`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .get(this.baseURI)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should return all parcel delivery orders belonging to a user', () => chai.request(this.server)
        .get(`${this.baseURI}/1/parcels`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(3);
          parcelDeliveryOrderTest(response.body[0]);
          // response.body[0].should.have.property('id');
          // response.body[0].should.have.property('destination');
          // response.body[0].should.have.property('price');
          // response.body[0].should.have.property('status');
          // response.body[0].status.should.have.property('code');
          // response.body[0].status.should.have.property('uiText');
        }));

      it('it should return an error if user is not found', () => chai.request(this.server)
        .get(`${this.baseURI}/999999/parcels`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eql('User not found');
        }));

      it('it should return an empty array if User has no parcel delivery orders.', () => chai.request(this.server)
        .get(`${this.baseURI}/2/parcels`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(0);
        }));
    });
  }
}

const test = new UsersApiTests();
test.runTests();
