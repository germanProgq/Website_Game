
// Create a new user
const createUser = async (username, email, passwordHash) => {
  try {
    const createUserQuery = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await client.query(createUserQuery, [username, email, passwordHash]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error creating user: ' + err.message);
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    const getUserQuery = 'SELECT * FROM users WHERE id = $1';
    const result = await client.query(getUserQuery, [userId]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  } catch (err) {
    throw new Error('Error getting user: ' + err.message);
  }
};

// Get user by email (for authentication)
const getUserByEmail = async (email) => {
  try {
    const getUserQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(getUserQuery, [email]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  } catch (err) {
    throw new Error('Error getting user: ' + err.message);
  }
};

// Update user details
const updateUser = async (userId, username, email) => {
  try {
    const updateUserQuery = `
      UPDATE users
      SET username = $1, email = $2
      WHERE id = $3
      RETURNING *;
    `;
    const result = await client.query(updateUserQuery, [username, email, userId]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Error updating user: ' + err.message);
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const deleteUserQuery = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    const result = await client.query(deleteUserQuery, [userId]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0];
  } catch (err) {
    throw new Error('Error deleting user: ' + err.message);
  }
};

// Export the user model methods
module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
