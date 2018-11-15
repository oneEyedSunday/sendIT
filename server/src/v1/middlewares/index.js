import jwt from 'jsonwebtoken';
import { parcelHelpers, userHelpers } from '../helpers/mockdb';

export default class Middleware {
  static isAuth(req, res, next) {
    if (req.url === '/api') return next();
    let interest = req.url.split('/api/v')[1];
    interest = interest.substr(2, 4);
    if ((interest === 'auth') && req.method === 'POST') return next();
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, process.env.secret, (err, payload) => {
        if (err) return res.json({ auth: false, message: 'Invalid token' });
        req.user = payload;
        return next();
      });
    } else {
      return res.status(401).json({
        auth: false,
        message: 'Authorization token is not provided.',
      });
    }
    return next(req);
  }

  static isAdmin(req, res, next) {
    if (req.user.admin) {
      next();
    } else {
      res.status(401).send({ error: 'Not authorized for admin access' });
    }
  }

  static parcelExists(req, res, next) {
    const parcelId = parseInt(req.params.id, 10);
    const parcel = parcelHelpers.find(parcelId);
    if (parcel === undefined || parcel === null) {
      return res.status(400).send({ error: 'Parcel delivery order not found.' });
    }
    req.parcel = parcel;
    return next();
  }

  static isOwner(req, res, next) {
    const userParcels = userHelpers.parcelsForUser(req.user.id);
    if (userParcels === undefined || userParcels === null || (userParcels.indexOf(parseInt(req.params.id, 10)) < 0)) {
      return res.status(403).send({ error: 'You do not have access to this resource' });
    }
    return next();
  }

  static isOwnerOrAdmin(req, res, next) {
    if (!req.user.admin) {
      // not admin, check if its owner
      const userParcels = userHelpers.parcelsForUser(req.user.id);
      if (userParcels === undefined || userParcels === null || (userParcels.indexOf(parseInt(req.params.id, 10)) < 0)) {
        // not owner
        return res.status(403).send({ error: 'You do not have access to this resource' });
      }
    }
    return next();
  }
}
