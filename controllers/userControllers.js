const User = require('../models/UserModel');

async function deleteUser(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);

    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { deleteUser };
