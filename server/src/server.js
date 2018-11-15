/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

import bodyParser from 'body-parser';
import express from 'express';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
// import routes
import ParcelsRoutes from './v1/routes/parcels';
import UsersRoutes from './v1/routes/users';
import AuthRoutes from './v1/routes/auth';
import Middleware from './v1/middlewares';

import db from './v1/helpers/db';
// import models

export class Server {
  constructor() {
    this.app = express();
    this.config();
    this.db();
    this.api();
  }

  static bootstrap() {
    return new Server();
  }

  api() {
    this.app.get('/api', (req, res) => res.json({
      message: 'Welcome to SendIT, assess api at /api/vx x being the version of the API you wish to access',
      dbSTatus: this.dbTest,
    }));
    this.app.get('/api/v1/', (req, res) => res.json({
      message: 'API v1 works',
    }));
    this.app.use('/api/v1/parcels', ParcelsRoutes);
    this.app.use('/api/v1/users', UsersRoutes);
    this.app.use('/api/v1/auth', AuthRoutes);
  }


  config() {
    dotenv.config();
    this.app.set('json spaces', 2);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(methodOverride());
    this.app.use(Middleware.isAuth);
    this.app.use((err, req, res, next) => {
      next(err);
    });
  }

  db() {
    this.pool = db.createPool();

    this.pool.on('connect', () => {
      console.log('connected to the db');
    });

    this.pool.query('SELECT NOW()', (err, res) => {
      console.log(err, res);
      this.dbTest = res.rows;
      this.pool.end();
    });
  }

  close() {
    this.app.close();
  }
}
