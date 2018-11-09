/* eslint-disable import/prefer-default-export */

import bodyParser from 'body-parser';
import express from 'express';
import methodOverride from 'method-override';
// import routes
import ParcelsRoutes from './v1/routes/parcels';
import UsersRoutes from './v1/routes/users';
// import models

export class Server {
  constructor() {
    this.app = express();
    this.config();
    this.api();
  }

  static bootstrap() {
    return new Server();
  }

  api() {
    this.app.get('/api', (req, res) => res.json({
      message: 'Welcome to SendIT, assess api at /api/vx x being the version of the API you wish to access',
    }));
    this.app.get('/api/v1/', (req, res) => res.json({
      message: 'API v1 works',
    }));
    this.app.use('/api/v1/parcels', ParcelsRoutes);
    this.app.use('/api/v1/users', UsersRoutes);
  }


  config() {
    this.app.set('json spaces', 2);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(methodOverride());
    this.app.use((err, req, res, next) => {
      next(err);
    });
  }

  close() {
    this.app.close();
  }
}
