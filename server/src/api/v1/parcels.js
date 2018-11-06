/* eslint-disable import/prefer-default-export */
import * as Parcels from '../../../data/parcels';

export class ParcelsApi {
  create(router) {
    router.get('/', (req, res) => this.list(req, res));
    router.get('/:id', (req, res) => this.get(req, res));
    return router;
  }

  constructor(router) {
    this.router = this.create(router);
  }

  // eslint-disable-next-line class-methods-use-this
  list(req, res) {
    const parcels = Parcels.findAll();
    return res.json(parcels);
  }

  // eslint-disable-next-line class-methods-use-this
  get(req, res) {
    return res.json(Parcels.find(parseInt(req.params.id, 10)));
  }
}
