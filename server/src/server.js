/* eslint-disable no-console */

import bodyParser from 'body-parser';
import express from 'express';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import swagger from 'swagger-ui-express';
import swaggerDoc from '../swagger.json';

// import routes
import ParcelsRoutes from './v1/routes/parcels';
import UsersRoutes from './v1/routes/users';
import AuthRoutes from './v1/routes/auth';
import Middleware from './v1/middlewares';
import db from './v1/models';


/**
 * Server module
 * @module server
 */
export default class Server {
  /**
   * @function constructor
   * @memberof module:server
   * @param {object} stdOut - debug interface
   * @returns {null} No return
   */
  constructor(stdOut) {
    this.app = express();
    this.config(stdOut);
    this.db();
    this.api();
  }

  /**
 * bootstrap - return an instance of server class
 *
 * @function bootstrap
 * @param {object} stdOut - debug interface
 * @memberof  module:server
 * @return {object} The server object
 */
  static bootstrap(stdOut) {
    return new Server(stdOut);
  }

  /**
 * api - Setup api endpoints
 *
 * @function api
 * @memberof  module:server
 * @returns {null} No return
 */
  api() {
    this.app.get('/api', (req, res) => res.json({
      message: 'Welcome to SendIT, assess api at /api/vx x being the version of the API you wish to access',
    }));
    this.app.get('/api/v1/', (req, res) => res.json({
      message: 'API v1 works',
    }));
    this.app.use('/api/v1/auth', AuthRoutes);
    this.app.use(Middleware.isAuth);
    this.app.use('/api/v1/parcels', ParcelsRoutes);
    this.app.use('/api/v1/users', UsersRoutes);
  }

  /**
 * config - Configure server
 *
 * @function config
 * @param {object} stdOut - debug interface
 * @memberof  module:server
 * @returns {null} No return
 */
  config(stdOut) {
    dotenv.config();
    this.debugger = stdOut;
    this.app.set('json spaces', 2);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(methodOverride());
    this.app.use('/api-docs', swagger.serve, swagger.setup(swaggerDoc));
  }

  /**
 * db - Setup DB connection
 *
 * @function db
 * @memberof  module:server
 * @returns {null} No return
 */
  db() {
    this.pool = db.createPool();

    this.pool.on('connect', () => {
      this.debugger('connected to the db');
    });
  }

  /**
 * close - Close and dispose server
 *
 * @function close
 * @memberof  module:server
 * @returns {null} No return
 */
  close() {
    this.app.close();
  }
}

export const { bootstrap } = Server;
