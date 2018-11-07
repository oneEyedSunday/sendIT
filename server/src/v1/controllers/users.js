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

  index(req, res) {
    const allUsers = UsersController.findAll();
    return res.json(allUsers);
  },
};

export default UsersController;
