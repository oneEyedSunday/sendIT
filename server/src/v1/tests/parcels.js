/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import http from 'http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import uuid from 'uuid/v4';
import { bootstrap } from '../../server';
import { statuses } from '../helpers/mockdb';

dotenv.config();
chai.should();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';
const port = 8082;
const { app } = bootstrap();
app.set('port', port);
const server = http.createServer(app);
server.listen(port).on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port ${port} elsewhere.`);
  process.exit(-1);
});

export const parcelDeliveryOrderTest = (parcelObj, options = null) => {
  parcelObj.should.have.property('id');
  parcelObj.should.have.property('destination');
  parcelObj.should.have.property('price');
  parcelObj.should.have.property('status');
  if (!(options && options.excludes && options.excludes.indexOf('presentlocation') > -1)) {
    parcelObj.should.have.property('presentlocation');
  }
};

/**
 * Parcel Api tests - All tests for the parcel endpont
 * @module tests/parcels
 */
export default class ParcelsApiTests {
  /**
   * @function constructor
   * @memberof module:parcel
   * @param {object} host - URL of server
   * @returns {null} No return
   */
  constructor(host = null) {
    this.server = host;
    this.baseURI = '/api/v1/parcels';
  }

  /**
 * runTests - run all tests specified
 *
 * @function runTests
 * @memberof  module:parcel
 * @return {null} No return
*/
  runTests() {
    describe('Parcels API Tests', () => {
      this.createOrder();
      this.listOrders();
      this.getOrder();
      this.cancelOrder();
      this.changeOrderDestination();
      this.changeOrderStatus();
      this.changeOrderLocation();

      after(() => {
        server.close();
      });
    });
  }

  /**
 * listOrders - a test to ensure listing orders is running as expected
 *
 * @function listOrders
 * @memberof  module:parcel
 * @return {null} No return
*/
  listOrders() {
    let mockAdmin;
    let mockUser;
    before((done) => {
      mockAdmin = jwt.sign({
        id: uuid(),
        admin: true,
      }, process.env.secret);
      mockUser = jwt.sign({ id: uuid() }, process.env.secret);
      done();
    });
    describe(`GET ${this.baseURI}`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .get(this.baseURI)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));
      it('it should not allow access to a user', () => chai.request(this.server)
        .get(this.baseURI)
        .set('Authorization', mockUser)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('error');
          response.body.should.have.property('error').eql('Not authorized for admin access');
        }));

      it('it should list all parcel delivery orders', () => chai.request(this.server)
        .get(this.baseURI)
        .set('Authorization', `Bearer ${mockAdmin}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
        }));
    });
  }

  /**
 * getOrder - a test to ensure getting orders is done as expected
 *
 * @function getOrder
 * @memberof  module:parcel
 * @return {null} No return
*/
  getOrder() {
    describe(`GET ${this.baseURI}/id`, () => {
      let mockAdminToken;
      let userCreatingParcelToken;
      let parcel;
      before((done) => {
        mockAdminToken = jwt.sign({
          id: uuid(),
          admin: true,
        }, process.env.secret);
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            email: `${Date.now()}@test.com`,
            password: 'finito',
            firstname: 'Test',
            lastname: 'Test',
          })
          .then((response) => {
            userCreatingParcelToken = response.body.token;
            jwt.verify(userCreatingParcelToken, process.env.secret, (_err, decoded) => {
              server.close();
              server.listen(port);
              if (decoded) {
                chai.request(this.server)
                  .post('/api/v1/parcels')
                  .send({
                    userId: decoded.id,
                    destination: 'Some Place',
                    pickUpLocation: 'Some pickup',
                  })
                  .set('Authorization', userCreatingParcelToken)
                  .then((createParcelResponse) => {
                    parcel = createParcelResponse.body;
                    done();
                  })
                  .catch(err => console.error('createParcelError', err));
              }
            });
          })
          .catch(err => console.error('User Sign up error ', err));
      });
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .get(`${this.baseURI}/${parcel.id}`)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should get a particular parcel delivery order by a given id', () => chai.request(this.server)
        .get(`${this.baseURI}/${parcel.id}`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          parcelDeliveryOrderTest(response.body);
          response.body.should.have.property('id').eql(parcel.id);
        }));

      it('it should return an error with appropriate status if parcel is not found', () => chai.request(this.server)
        .get(`${this.baseURI}/999999`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(400);
          response.should.should.be.an('object');
          response.body.should.have.property('error').eql('error: invalid input syntax for type uuid: "999999"');
        }));
    });
  }

  /**
 * creatOrder - a test to ensure orders are created as expected
 *
 * @function createOrder
 * @memberof  module:parcel
 * @return {null} No return
*/
  createOrder() {
    let userCreatingParcelToken;
    let parcel;
    describe(`POST ${this.baseURI}`, () => {
      before((done) => {
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            email: `user-Pa${Date.now()}@test.com`,
            password: 'finito',
            firstname: 'Test',
            lastname: 'Test',
          })
          .then((response) => {
            userCreatingParcelToken = response.body.token;
            parcel = {
              destination: 'Some Destination',
              pickUpLocation: 'Some Pickup',
            };
            done();
          })
          .catch(err => console.error('User Sign up error ', err));
      });
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .post(this.baseURI)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should create a parcel delivery order', () => {
        chai.request(this.server).post(this.baseURI)
          .send(parcel)
          .set('Authorization', `Bearer ${userCreatingParcelToken}`)
          .then((response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            parcelDeliveryOrderTest(response.body);
          });
      });

      it('it should not create a parcel delivery order without destination speciified', () => chai.request(this.server)
        .post(this.baseURI)
        .send({ pickUpLocation: 'Some Pickup' })
        .set('Authorization', `Bearer ${userCreatingParcelToken}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors[0].should.have.property('field').eql('destination');
          response.body.errors[0].should.have.property('message').eql('destination cannot be missing');
        }));

      it('it should not create a parcel delivery order without the pick up location speciified', () => chai.request(this.server)
        .post(this.baseURI)
        .send({ destination: 'SOme Destination' })
        .set('Authorization', `Bearer ${userCreatingParcelToken}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors[0].should.have.property('field').eql('pickUpLocation');
          response.body.errors[0].should.have.property('message').eql('pickUpLocation cannot be missing');
        }));

      it('it should not create a parcel delivery order without the pick up location and destination speciified', () => chai.request(this.server)
        .post(this.baseURI)
        .send({})
        .set('Authorization', `Bearer ${userCreatingParcelToken}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors[0].should.have.property('field').eql('destination');
          response.body.errors[0].should.have.property('message').eql('destination cannot be missing');
          response.body.errors[1].should.have.property('field').eql('pickUpLocation');
          response.body.errors[1].should.have.property('message').eql('pickUpLocation cannot be missing');
        }));
    });
  }


  /**
 * cancelOrder - a test to ensure cance order works as expected
 *
 * @function cancelOrder
 * @memberof  module:parcel
 * @return {null} No return
*/
  cancelOrder() {
    let mockAdminToken;
    let userCreatingParcelToken;
    let parcel;
    describe(`PUT ${this.baseURI}/id`, () => {
      before((done) => {
        mockAdminToken = jwt.sign({
          id: uuid(),
          admin: true,
        }, process.env.secret);
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            email: `user-${Date.now()}Pahahagta@test.com`,
            password: 'finito',
            firstname: 'Test',
            lastname: 'Test',
          })
          .then((response) => {
            userCreatingParcelToken = response.body.token;
            jwt.verify(userCreatingParcelToken, process.env.secret, (_err, decoded) => {
              server.close();
              server.listen(port);
              if (decoded) {
                chai.request(this.server)
                  .post('/api/v1/parcels')
                  .send({
                    userId: decoded.id,
                    destination: 'Some Place',
                    pickUpLocation: 'Some pickup',
                  })
                  .set('Authorization', userCreatingParcelToken)
                  .then((createParcelResponse) => {
                    parcel = createParcelResponse.body;
                    done();
                  })
                  .catch(err => console.error('createParcelError', err));
              }
            });
          })
          .catch(err => console.error('User Sign up error ', err));
      });
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/cancel`)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should not allow you cancel a parcel delivery order you do not own', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/cancel`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(403);
          response.should.be.a('object');
          response.body.should.have.property('error').eql('You do not have access to this resource');
        }));

      it('it should cancel a parcel delivery order', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/cancel`)
        .set('Authorization', `Bearer ${userCreatingParcelToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.should.be.a('object');
          parcelDeliveryOrderTest(response.body, { excludes: ['presentLocation'] });
          response.body.status.should.eql(statuses.Cancelled.code);
        }));

      it('it should return an error with appropriate error code if the parcel delivery order is not found', () => chai.request(this.server)
        .put(`${this.baseURI}/999999/cancel`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(400);
          response.should.should.be.an('object');
          response.body.should.have.property('error').eql('error: invalid input syntax for type uuid: "999999"');
        }));
    });
  }

  /**
 * changeOrderDestination - a test to ensure order destination is changed successfully
 *
 * @function changeOrderDestination
 * @memberof  module:parcel
 * @return {null} No return
*/
  changeOrderDestination() {
    let mockAdminToken;
    let userCreatingParcelToken;
    let parcel;
    describe(`PUT ${this.baseURI}/id/destination`, () => {
      before((done) => {
        mockAdminToken = jwt.sign({
          id: uuid(),
          admin: true,
        }, process.env.secret);
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            email: `user-${Date.now()}Pahahagta@test.com`,
            password: 'finito',
            firstname: 'Test',
            lastname: 'Test',
          })
          .then((response) => {
            userCreatingParcelToken = response.body.token;
            jwt.verify(userCreatingParcelToken, process.env.secret, (_err, decoded) => {
              server.close();
              server.listen(port);
              if (decoded) {
                chai.request(this.server)
                  .post('/api/v1/parcels')
                  .send({
                    userId: decoded.id,
                    destination: 'Some Place',
                    pickUpLocation: 'Some pickup',
                  })
                  .set('Authorization', userCreatingParcelToken)
                  .then((createParcelResponse) => {
                    parcel = createParcelResponse.body;
                    done();
                  })
                  .catch(err => console.error('createParcelError', err));
              }
            });
          })
          .catch(err => console.error('User Sign up error ', err));
      });
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .put(`${this.baseURI}/id/destination`)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should not allow you change destination of a parcel delivery order you do not own', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/destination`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(403);
          response.should.be.a('object');
          response.body.should.have.property('error').eql('You do not have access to this resource');
        }));


      it('it should not allow you change destination without providing new destination', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/destination`)
        .set('Authorization', `Bearer ${userCreatingParcelToken}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors[0].should.have.property('field').eql('destination');
          response.body.errors[0].should.have.property('message').eql('destination cannot be missing');
        }));

      const newDestination = 'TOS Benson, Ikorodu';

      it('it should allow you change the destination of a parcel delivery order you own', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/destination`)
        .send({ destination: newDestination })
        .set('Authorization', `Bearer ${userCreatingParcelToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.should.be.a('object');
          parcelDeliveryOrderTest(response.body);
          response.body.should.have.property('destination').eql(newDestination.toLowerCase());
          response.body.should.have.property('status').eql(statuses.AwaitingProcessing.code);
        }));
    });
  }

  /**
 * changeOrderStatus - a test to ensure order status is changed successfully
 *
 * @function changeOrderStatus
 * @memberof  module:parcel
 * @return {null} No return
*/
  changeOrderStatus() {
    let mockAdminToken;
    let userCreatingParcelToken;
    let parcel;
    before((done) => {
      mockAdminToken = jwt.sign({
        id: uuid(),
        admin: true,
      }, process.env.secret);
      chai.request(this.server)
        .post('/api/v1/auth/signup')
        .send({
          email: `user-${Date.now()}Pahahagta@test.com`,
          password: 'finito',
          firstname: 'Test',
          lastname: 'Test',
        })
        .then((response) => {
          userCreatingParcelToken = response.body.token;
          jwt.verify(userCreatingParcelToken, process.env.secret, (_err, decoded) => {
            server.close();
            server.listen(port);
            if (decoded) {
              chai.request(this.server)
                .post('/api/v1/parcels')
                .send({
                  userId: decoded.id,
                  destination: 'Some Place',
                  pickUpLocation: 'Some pickup',
                })
                .set('Authorization', userCreatingParcelToken)
                .then((createParcelResponse) => {
                  parcel = createParcelResponse.body;
                  done();
                })
                .catch(err => console.error('createParcelError', err));
            }
          });
        })
        .catch(err => console.error('User Sign up error ', err));
    });
    describe(`PUT ${this.baseURI}/id/status`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/status`)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should not allow access to non-admins', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/status`)
        .set('Authorization', `Bearer ${userCreatingParcelToken}`)
        .then((response) => {
          response.should.have.status(401);
          response.should.be.a('object');
          response.body.should.have.property('error').eql('Not authorized for admin access');
        }));

      it('it should not allow you admin to change status without providing new status', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/status`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors[0].should.have.property('field').eql('status');
          response.body.errors[0].should.have.property('message').eql('status cannot be missing');
        }));

      it('it should allow an admin to change status of a parcel delivery order', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/status`)
        .send({ status: statuses.Delivered.code })
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.should.be.a('object');
          parcelDeliveryOrderTest(response.body);
          response.body.should.have.property('status').eql(statuses.Delivered.code);
        }));
    });
  }

  /**
 * changeOrderLocation - a test to ensure order location is changed successfully
 *
 * @function changeOrderDestination
 * @memberof  module:parcel
 * @return {null} No return
*/
  changeOrderLocation() {
    let mockAdminToken;
    let userCreatingParcelToken;
    let parcel;
    describe(`PUT ${this.baseURI}/id/presentLocation`, () => {
      before((done) => {
        mockAdminToken = jwt.sign({
          id: uuid(),
          admin: true,
        }, process.env.secret);
        chai.request(this.server)
          .post('/api/v1/auth/signup')
          .send({
            email: `user-${Date.now()}Pahahagta@test.com`,
            password: 'finito',
            firstname: 'Test',
            lastname: 'Test',
          })
          .then((response) => {
            userCreatingParcelToken = response.body.token;
            jwt.verify(userCreatingParcelToken, process.env.secret, (_err, decoded) => {
              server.close();
              server.listen(port);
              if (decoded) {
                chai.request(this.server)
                  .post('/api/v1/parcels')
                  .send({
                    userId: decoded.id,
                    destination: 'Some Place',
                    pickUpLocation: 'Some pickup',
                  })
                  .set('Authorization', userCreatingParcelToken)
                  .then((createParcelResponse) => {
                  // parcel
                    parcel = createParcelResponse.body;
                    done();
                  // extract parcelId
                  })
                  .catch(err => console.error('createParcelError', err));
              }
            });
          })
          .catch(err => console.error('User Sign up error ', err));
      });
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/presentLocation`)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should not allow access to non-admins', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/presentLocation`)
        .set('Authorization', `Bearer ${userCreatingParcelToken}`)
        .then((response) => {
          response.should.have.status(401);
          response.should.be.a('object');
          response.body.should.have.property('error').eql('Not authorized for admin access');
        }));

      it('it should not allow you admin to change status without providing new location', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/presentLocation`)
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors[0].should.have.property('field').eql('presentLocation');
          response.body.errors[0].should.have.property('message').eql('presentLocation cannot be missing');
        }));

      const newLocation = 'Mile 12, Lagos';
      it('it should allow an admin to update Location of a parcel delivery order', () => chai.request(this.server)
        .put(`${this.baseURI}/${parcel.id}/presentLocation`)
        .send({ presentLocation: newLocation })
        .set('Authorization', `Bearer ${mockAdminToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.should.be.a('object');
          parcelDeliveryOrderTest(response.body, { excludes: ['presentlocation'] });
          response.body.should.have.property('presentlocation').eql(newLocation.toLowerCase());
        }));
    });
  }
}

new ParcelsApiTests(`http://localhost:${port}`).runTests();
