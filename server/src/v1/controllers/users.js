import parcelsController from './parcels';

const users = [
  {
    id: 1,
    parcels: [1, 2, 3],
    fullName: 'User One',
  },
  {
    id: 2,
    parcels: [],
    fullName: 'User Two',
  },
];

const UsersController = {
  findAll() {
    return users || [];
  },

  getUser(userId) {
    return users.filter(items => items.id === userId)[0];
  },

  parcelsForUser(userId) {
    const user = UsersController.getUser(userId);
    if (user === undefined || user === null) {
      throw new Error('User not found');
    }
    return user.parcels;
  },

  index(req, res) {
    const allUsers = UsersController.findAll();
    return res.json(allUsers);
  },

  parcels(req, res) {
    try {
      const userParcels = UsersController.parcelsForUser(parseInt(req.params.id, 10));
      const populatedUserParcels = parcelsController.retrieveParcels(userParcels);
      return res.json(populatedUserParcels);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },
};

export default UsersController;
