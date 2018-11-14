/* eslint-env node, mocha */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import http from 'http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Server } from '../../server';

dotenv.config();
chai.should();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';
const port = 8081;
const { app } = Server.bootstrap();
app.set('port', port);
const server = http.createServer(app);
server.listen(port).on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port ${port} elsewhere.`);
  process.exit(-1);
});
export default class UsersApiTests {
  constructor(host = null) {
    this.server = host;
    this.baseURI = '/api/v1/users';
  }


  runTests() {
    describe('Users API Tests', () => {
      before((done) => {
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            user: {
              email: 'pierDragowki@yahoo.com',
              password: 'finito',
              firstname: 'Pier',
              lastname: 'Dragowski',
            },
          })
          .then((response) => {
            this.token = response.body.token;
          })
          .catch(err => console.error(err));

        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            user: {
              email: 'test@test.com',
              password: 'finito',
              firstname: 'Test',
              lastname: 'Test',
            },
          })
          .then((response) => {
            this.allowedUserToken = response.body.token;
          })
          .catch(err => console.error(err));

        this.mockAdminToken = jwt.sign({
          id: 5,
          admin: true,
        }, process.env.secret);
        done();
      });
      this.list();
      this.getUserParcels();

      after(() => {
        server.close();
      });
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

      it('it should not return all parcel delivery orders belonging to a user if accessed by a different user', () => chai.request(this.server)
        .get(`${this.baseURI}/1/parcels`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(403);
          response.should.be.an('object');
          response.body.should.have.property('error');
          response.body.should.have.property('error').eql('You do not have access to this resource');
        }));

      it('it should return all parcel delivery orders belonging to a user if accessed by an admin', () => chai.request(this.server)
        .get(`${this.baseURI}/1/parcels`)
        .set('Authorization', `Bearer ${this.mockAdminToken}`)
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

      it('it should return all parcel delivery orders belonging to a user if accessed by user', () => chai.request(this.server)
        .get(`${this.baseURI}/4/parcels`)
        .set('Authorization', `Bearer ${this.allowedUserToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(1);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('destination');
          response.body[0].should.have.property('price');
          response.body[0].should.have.property('status');
          response.body[0].status.should.have.property('code');
          response.body[0].status.should.have.property('uiText');
        }));

      it('it should return an error if user is not found', () => chai.request(this.server)
        .get(`${this.baseURI}/999999/parcels`)
        .set('Authorization', `Bearer ${this.mockAdminToken}`)
        .then((response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eql('User not found');
        }));

      it('it should return an empty array if User has no parcel delivery orders.', () => chai.request(this.server)
        .get(`${this.baseURI}/2/parcels`)
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
