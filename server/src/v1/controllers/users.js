import dbHelpers from '../helpers/db/helpers';


const UsersController = {
  index(req, res) {
    dbHelpers.findAll('users')
      .then(result => res.json(result))
      .catch(error => res.status(400).json({ error: error.message }));
  },

  getParcels(req, res) {
    if (!req.user.admin && (req.user.id !== req.params.id)) {
      return res.status(403).json({ error: 'You do not have access to this resource' });
    }
    dbHelpers.getParcelsByUserId(req.params.id)
      .then(parcels => res.json(parcels))
      .catch(error => res.status(400).json({ error: error.message }));
  },
};

export default UsersController;
