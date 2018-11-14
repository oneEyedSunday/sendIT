/* eslint-env node, mocha */
/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import http from 'http';
import dotenv from 'dotenv';
import { Server } from '../../server';
import { statuses } from '../helpers/mockdb';

dotenv.config();
chai.should();
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';
const port = 8082;
const { app } = Server.bootstrap();
app.set('port', port);
const server = http.createServer(app);
server.listen(port).on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`An error occured with errcode ${err.code}, couldn't start server.\nPlease close instances of server on port ${port} elsewhere.`);
  process.exit(-1);
});


let noOfParcels = 4;
const createParcel = (exclude = []) => {
  const parcel = {};
  if (exclude.indexOf('destination') < 0) parcel.destination = 'Lekki, Lagos';
  if (exclude.indexOf('pickUpLocation') < 0) parcel.pickUpLocation = 'Muson Centre, Lekki';
  return parcel;
};

export const parcelDeliveryOrderTest = (parcelObj, options = null) => {
  parcelObj.should.have.property('id');
  parcelObj.should.have.property('destination');
  parcelObj.should.have.property('price');
  parcelObj.should.have.property('status');
  if (!(options && options.excludes && options.excludes.indexOf('presentLocation') > -1)) {
    parcelObj.should.have.property('presentLocation');
  }
  parcelObj.status.should.have.property('code');
  parcelObj.status.should.have.property('uiText');
};

export default class ParcelsApiTests {
  constructor(host = null) {
    this.server = host;
    this.baseURI = '/api/v1/parcels';
  }

  runTests() {
    describe('Parcels API Tests', () => {
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

        this.parcel = createParcel();
        this.parcelWithoutDestination = createParcel(['destination']);
        this.parcelWithoutPickUpLocation = createParcel(['pickUpLocation']);
        this.bareParcel = createParcel(['destination', 'pickUpLocation']);
        done();
      });
      this.createOrder();
      this.listOrders();
      this.getOrder();
      this.cancelOrder();
      this.changeOrderDestination();

      after(() => {
        server.close();
      });
    });
  }

  listOrders() {
    describe(`GET ${this.baseURI}`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .get(this.baseURI)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should list all parcel delivery orders', () => chai.request(this.server)
        .get(this.baseURI)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eql(noOfParcels);
        }));
    });
  }

  getOrder() {
    describe(`GET ${this.baseURI}/id`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .get(`${this.baseURI}/id`)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should get a particular parcel delivery order by a given id', () => chai.request(this.server)
        .get(`${this.baseURI}/1`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          parcelDeliveryOrderTest(response.body);
          response.body.should.have.property('id').eql(1);
        }));

      it('it should return an error with appropriate status if parcel is not found', () => chai.request(this.server)
        .get(`${this.baseURI}/999999`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(400);
          response.should.should.be.an('object');
          response.body.should.have.property('error').eql('Parcel delivery order not found.');
        }));
    });
  }

  createOrder() {
    describe(`POST ${this.baseURI}`, () => {
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
          .send({ parcel: this.parcel })
          .set('Authorization', `Bearer ${this.token}`)
          .then((response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            parcelDeliveryOrderTest(response.body);
            this.parcel.id = response.body.id;
            noOfParcels += 1;
          });
      });

      it('it should not create a parcel delivery order without destination speciified', () => chai.request(this.server)
        .post(this.baseURI)
        .send({ parcel: this.parcelWithoutDestination })
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors.length.should.be.eql(1);
          response.body.errors[0].should.have.property('field').eql('destination');
          response.body.errors[0].should.have.property('message').eql('destination cannot be missing');
        }));

      it('it should not create a parcel delivery order without the pick up location speciified', () => chai.request(this.server)
        .post(this.baseURI)
        .send({ parcel: this.parcelWithoutPickUpLocation })
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors.length.should.be.eql(1);
          response.body.errors[0].should.have.property('field').eql('pickUpLocation');
          response.body.errors[0].should.have.property('message').eql('pickUpLocation cannot be missing');
        }));

      it('it should not create a parcel delivery order without the pick up location and destination speciified', () => chai.request(this.server)
        .post(this.baseURI)
        .send({ parcel: this.bareParcel })
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors.length.should.be.eql(2);
          response.body.errors[0].should.have.property('field').eql('destination');
          response.body.errors[0].should.have.property('message').eql('destination cannot be missing');
          response.body.errors[1].should.have.property('field').eql('pickUpLocation');
          response.body.errors[1].should.have.property('message').eql('pickUpLocation cannot be missing');
        }));
    });
  }

  cancelOrder() {
    const url = `${this.baseURI}/4/cancel`;
    describe(`PUT ${url}`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .put(`${url}`)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should not allow you cancel a parcel delivery order you do not own', () => chai.request(this.server)
        .put(`${url}`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(403);
          response.should.be.a('object');
          response.body.should.have.property('error').eql('You do not have access to this resource');
        }));

      it('it should cancel a parcel delivery order', () => chai.request(this.server)
        .put(`${url}`)
        .set('Authorization', `Bearer ${this.allowedUserToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.should.be.a('object');
          parcelDeliveryOrderTest(response.body, { excludes: ['presentLocation'] });
          response.body.status.should.eql(statuses.Cancelled);
        }));

      it('it should return an error with appropriate error code if the parcel delivery order is not found', () => chai.request(this.server)
        .put(`${this.baseURI}/999999/cancel`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(400);
          response.should.be.a('object');
          response.body.should.have.property('error').eql('Parcel delivery order not found.');
        }));
    });
  }

  changeOrderDestination() {
    const url = `${this.baseURI}/4/destination`;
    describe(`PUT ${url}`, () => {
      it('it should not allow access to this endpoint if no Auth token is provided', () => chai.request(this.server)
        .put(`${url}`)
        .then((response) => {
          response.should.have.status(401);
          response.body.should.be.an('object');
          response.body.should.have.property('auth').eql(false);
          response.body.should.have.property('message').eql('Authorization token is not provided.');
        }));

      it('it should not allow you change destination of a parcel delivery order you do not own', () => chai.request(this.server)
        .put(`${url}`)
        .set('Authorization', `Bearer ${this.token}`)
        .then((response) => {
          response.should.have.status(403);
          response.should.be.a('object');
          response.body.should.have.property('error').eql('You do not have access to this resource');
        }));

      it('it should not allow you change destination without providing new destination', () => chai.request(this.server)
        .put(`${url}`)
        .set('Authorization', `Bearer ${this.allowedUserToken}`)
        .then((response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('message').eql('Validation errors');
          response.body.should.have.property('errors');
          chai.assert(Array.isArray(response.body.errors), true);
          response.body.errors.length.should.be.eql(1);
          response.body.errors[0].should.have.property('field').eql('destination');
          response.body.errors[0].should.have.property('message').eql('destination cannot be missing');
        }));

      const newDestination = 'TOS Benson, Ikorodu';

      it('it should allow you change the destination of a parcel delivery order you own', () => chai.request(this.server)
        .put(`${url}`)
        .send({ destination: newDestination })
        .set('Authorization', `Bearer ${this.allowedUserToken}`)
        .then((response) => {
          response.should.have.status(200);
          response.should.be.a('object');
          parcelDeliveryOrderTest(response.body);
          response.body.should.have.property('destination').eql(newDestination);
          response.body.should.have.property('status').eql(statuses.AwaitingProcessing);
        }));
    });
  }
}

new ParcelsApiTests(`http://localhost:${port}`).runTests();
// server.close();
