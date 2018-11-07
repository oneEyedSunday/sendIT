import parcelsController from './parcels';

const users = [
  {
    id: 1,
    parcels: [1, 2, 3],
    fullName: 'User One',
  },
];

const UsersController = {
  findAll() {
    return users;
  },

  getUser(userId) {
    return users.filter(items => items.id === userId)[0];
  },

  parcelsForUser(userId) {
    const user = UsersController.getUser(userId);
    return user.parcels;
  },

  index(req, res) {
    const allUsers = UsersController.findAll();
    return res.json(allUsers);
  },

  parcels(req, res) {
    const userParcels = UsersController.parcelsForUser(parseInt(req.params.id, 10));
    const populatedUserParcels = parcelsController.retrieveParcels(userParcels);
    return res.json(populatedUserParcels);
  },
};

export default UsersController;
