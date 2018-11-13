/* eslint-env node, mocha */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import BaseApiTestClass from './base';
// import { parcelDeliveryOrderTest } from './parcels';


chai.should();
chai.use(chaiHttp);

export default class UsersApiTests extends BaseApiTestClass {
  constructor(server = null, token = null) {
    super(server);
    console.log('user test created');
    this.baseURI = '/api/v1/users';
    this.token = token;
  }

  runTests() {
    describe('Users API Tests', () => {
      this.list();
      this.getUserParcels();
      this.after();
    });
  }

  list() {
    describe(`GET ${this.baseURI}`, () => {
      it('it should list all users', () => chai.request(this.server)
        .get(this.baseURI)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          console.log(response.body);
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(2);
        }));
    });
  }

  getUserParcels() {
    describe(`GET ${this.baseURI}/1/parcels`, () => {
      it('it should return all parcel delivery orders belonging to a user', () => chai.request(this.server)
        .get(`${this.baseURI}/1/parcels`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(3);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('destination');
          response.body[0].should.have.property('price');
          response.body[0].should.have.property('status');
          response.body[0].status.should.have.property('code');
          response.body[0].status.should.have.property('uiText');
        }));

      it('it should return an error if user is not found', () => chai.request(this.server)
        .get(`${this.baseURI}/999999/parcels`)
        .then((response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eql('User not found');
        }));

      it('it should return an empty array if User has no parcel delivery orders.', () => chai.request(this.server)
        .get(`${this.baseURI}/2/parcels`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(0);
        }));
    });
  }
}
