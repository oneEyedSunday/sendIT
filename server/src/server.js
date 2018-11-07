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
    this.app.use('/api/v1/parcels', ParcelsRoutes);
    this.app.use('/api/v1/users', UsersRoutes);
    this.app.use('/', (req, res) => res.json({
      message: 'Welcome to SendIT, assess api at /api/v1',
    }));
  }


  config() {
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
