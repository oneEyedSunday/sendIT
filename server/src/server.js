/* eslint-disable import/prefer-default-export */

import bodyParser from 'body-parser';
import express from 'express';
import methodOverride from 'method-override';
// import routes
import { apis } from './api/v1';
// import models

export class Server {
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.api();
  }

  static bootstrap() {
    return new Server();
  }

  api() {
    this.app.use('/api/v1/parcels', this.routesObj.ParcelsApi.router);
  }

  // eslint-disable-next-line class-methods-use-this
  routes() {
    const router = express.Router();
    this.routesObj = {};
    const ParcelsApi = new apis.ParcelsApi(router);
    this.routesObj.ParcelsApi = ParcelsApi;
    this.router = router;
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
