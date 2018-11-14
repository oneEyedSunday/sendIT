import { userHelpers, parcelHelpers } from '../helpers/mockdb';


const UsersController = {
  index(req, res) {
    const allUsers = userHelpers.findAll();
    return res.json(allUsers);
  },

  parcels(req, res) {
    try {
      const userParcels = userHelpers.parcelsForUser(parseInt(req.params.id, 10));
      const populatedUserParcels = parcelHelpers.retrieveParcels(userParcels);
      return res.json(populatedUserParcels);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },
};

export default UsersController;
