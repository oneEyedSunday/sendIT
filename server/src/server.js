/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

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

import db from './v1/helpers/db';
// import models

/**
 * Server module
 * @module server
 */
export default class Server {
  /**
   * @function constructor
   * @memberof module:server
   * @returns {null} No return
   */
  constructor() {
    this.app = express();
    this.config();
    this.db();
    this.api();
  }

  /**
 * bootstrap - return an instance of server class
 *
 * @function bootstrap
 * @memberof  module:server
 * @return {object} The server object
 */
  static bootstrap() {
    return new Server();
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
    this.app.use('/api/v1/parcels', ParcelsRoutes);
    this.app.use('/api/v1/users', UsersRoutes);
    this.app.use('/api/v1/auth', AuthRoutes);
  }

  /**
 * config - Configure server
 *
 * @function config
 * @memberof  module:server
 * @returns {null} No return
 */
  config() {
    dotenv.config();
    this.app.set('json spaces', 2);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(methodOverride());
    this.app.use('/api-docs', swagger.serve, swagger.setup(swaggerDoc));
    this.app.use(Middleware.isAuth);
    // this.app.use((err, req, res, next) => {
    //   next(err);
    // });
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
      console.log('connected to the db');
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
/*
const port = 8080;
const { app } = Server.bootstrap();
app.set('port', port);
const server = http.createServer(app);
server.listen(port).on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error(`An error occured with errcode ${err.code},
  couldn't start server.\nPlease close instances of server on port ${port} elsewhere.`);
  process.exit(-1);
});
*/


export const { bootstrap } = Server;
