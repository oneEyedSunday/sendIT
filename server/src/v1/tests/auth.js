/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import http from 'http';
import dotenv from 'dotenv';
import { bootstrap } from '../../server';

dotenv.config();
chai.should();
chai.use(chaiHttp);
const { assert } = chai;

process.env.NODE_ENV = 'test';
const port = 8083;
const { app } = bootstrap();
app.set('port', port);
const server = http.createServer(app);
server.listen(port).on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port ${port} elsewhere.`);
  process.exit(-1);
});

/**
 * Auth Api tests - All tests for the authentication endpont
 * @module tests/auth
 */
export default class AuthApiTests {
  /**
     * @function constructor
     * @memberof module:auth
     * @param {object} host - URL of server
     * @returns {null} No return
     */
  constructor(host = null) {
    this.server = host;
    this.baseURI = '/api/v1/auth';
  }

  /**
   * runTests - run all tests specified
   *
   * @function runTests
   * @memberof  module:users
   * @return {null} No return
  */
  runTests() {
    this.email = `${Date.now()}@yahoo.com`;
    this.password = 'finito';
    describe('Auth API Tests', () => {
      this.testSignUp();
      this.testLogIn();

      after(() => {
        server.close();
      });
    });
  }

  /**
 * testSignUp - a test to ensure sign up works as expected
 *
 * @function testSignUp
 * @memberof  module:auth
 * @return {null} No return
*/
  testSignUp() {
    describe(`POST ${this.baseURI}/signup`, () => {
      it('it should not sign up if email is not provided', () => chai.request(this.server)
        .post(`${this.baseURI}/signup`)
        .send({
          firstname: 'Whiz Kid',
          lastname: 'Khalifa',
          password: 'dongoyaroo'
        })
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.an('object');
          response.body.should.have.property('message').should.be.an('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.an('array');
          assert(response.body.errors.length > 1, 'Errors should be an array with more than one entry');
        }));

      it('it should not sign up if firstname is not provided', () => chai.request(this.server)
        .post(`${this.baseURI}/signup`)
        .send({
          email: this.email,
          lastname: 'Khalifa',
          password: 'dongoyaroo'
        })
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.an('object');
          response.body.should.have.property('message').should.be.an('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.an('array');
          assert(response.body.errors.length = 1, 'Errors should be an array with one entry');
          response.body.errors[0].should.have.property('field').eql('firstname');
          response.body.errors[0].should.have.property('message').eql('firstname cannot be missing');
        }));

      it('it should not sign up if lastname is not provided', () => chai.request(this.server)
        .post(`${this.baseURI}/signup`)
        .send({
          email: this.email,
          firstname: 'Whiz Kid',
          password: this.password
        })
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.an('object');
          response.body.should.have.property('message').should.be.an('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.an('array');
          assert(response.body.errors.length = 1, 'Errors should be an array with one entry');
          response.body.errors[0].should.have.property('field').eql('lastname');
          response.body.errors[0].should.have.property('message').eql('lastname cannot be missing');
        }));

      it('it should not sign up if password is not provided', () => chai.request(this.server)
        .post(`${this.baseURI}/signup`)
        .send({
          email: this.email,
          firstname: 'Whiz Kid',
          lastname: 'Khalifa',
        })
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.an('object');
          response.body.should.have.property('message').should.be.an('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.an('array');
          assert(response.body.errors.length = 1, 'Errors should be an array with one entry');
          response.body.errors[0].should.have.property('field').eql('password');
          response.body.errors[0].should.have.property('message').eql('password cannot be missing');
        }));

        it('it should not sign up if email is provided but is not valid', () => chai.request(this.server)
        .post(`${this.baseURI}/signup`)
        .send({
          email: 'someinvalidemail',
          firstname: 'Whiz Kid',
          lastname: 'Khalifa',
          password: 'dongoyaroo'
        })
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.an('object');
          response.body.should.have.property('message').should.be.an('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.an('array');
          assert(response.body.errors.length = 1, 'Errors should be an array with one entry');
          response.body.errors[0].should.have.property('field').eql('email');
          response.body.errors[0].should.have.property('message').eql('Email is Invalid');
        }));

        it('it should not sign up if password is provided but less than 6 characters', () => chai.request(this.server)
        .post(`${this.baseURI}/signup`)
        .send({
          email: this.email,
          firstname: 'Whiz Kid',
          lastname: 'Khalifa',
          password: 'dong'
        })
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.an('object');
          response.body.should.have.property('message').should.be.an('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.an('array');
          assert(response.body.errors.length = 1, 'Errors should be an array with one entry');
          response.body.errors[0].should.have.property('field').eql('password');
          response.body.errors[0].should.have.property('message').eql('Password length must be more than six characters');
        }));

        it('it should sign up if all requirements are met', () => chai.request(this.server)
        .post(`${this.baseURI}/signup`)
        .send({
          email: this.email,
          firstname: 'Whiz Kid',
          lastname: 'Khalifa',
          password: this.password
        })
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('user').should.be.an('object');
          response.body.should.have.property('token').should.be.an('object');
        }));
    });
  }

  testLogIn() {
    describe(`POST ${this.baseURI}/login`, () => {
      const loggedInUser = {
        email: `${Date.now()}@test.com`,
        password: 'somegenericpasswordstring',
        lastname: 'smelastname',
        firstname: 'somefirstname'
      };

      before((done) => {
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send(loggedInUser)
          .then((response) => {
            this.allowedUserToken = response.body.token;
            done();
          })
          .catch(err => console.error('User Sign up error ', err));
      });
      it('it should not log in if email and password do not match', () => chai.request(this.server)
        .post(`${this.baseURI}/login`)
        .send({
          email: 'akakkakakakakka@kskks.com',
          password: loggedInUser.password
        })
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth');
          response.body['auth'].should.eql(false);
          response.body.should.have.property('message');
          response.body.message.should.eql('Invalid credentials');
        }));

      it('it should log in if details are correct', () => chai.request(this.server)
        .post(`${this.baseURI}/login`)
        .send({
          email: loggedInUser.email,
          password: loggedInUser.password
        })
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(true);
          response.body.token.should.be.a('string');
        }));

      it('it should not attempt log in if required credentials were not provided', () => chai.request(this.server)
        .post(`${this.baseURI}/login`)
        .send({
          email: loggedInUser.email,
          password: ''
        })
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.an('object');
          response.body.should.have.property('message').should.be.an('object');
          response.body.should.have.property('errors');
          response.body.errors.should.be.an('array');
          assert(response.body.errors.length = 1, 'Errors should be an array with one entry');
          response.body.errors[0].should.have.property('field').eql('password');
          response.body.errors[0].should.have.property('message').eql('password cannot be missing');
        }));
    });
  }
}

new AuthApiTests(`http://localhost:${port}`).runTests();
