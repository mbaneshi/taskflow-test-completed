/**
 * User Model Tests
 * 
 * Comprehensive tests for the User model including validation,
 * methods, and database operations.
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import mongoose from 'mongoose';
import User from '../../../server/src/models/User.js';

describe('User Model', () => {
  beforeAll(async () => {
    // Ensure we're connected to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    // Clean up after all tests
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('Schema Validation', () => {
    test('should create a valid user with all required fields', async () => {
      const validUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await validUser.save();
      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe('testuser');
      expect(savedUser.email).toBe('test@example.com');
      expect(savedUser.role).toBe('user'); // default value
      expect(savedUser.isActive).toBe(true); // default value
    });

    test('should require username field', async () => {
      const userWithoutUsername = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      let error;
      try {
        await userWithoutUsername.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();
    });

    test('should require email field', async () => {
      const userWithoutEmail = new User({
        username: 'testuser',
        password: 'password123'
      });

      let error;
      try {
        await userWithoutEmail.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    test('should require password field', async () => {
      const userWithoutPassword = new User({
        username: 'testuser',
        email: 'test@example.com'
      });

      let error;
      try {
        await userWithoutPassword.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    test('should validate email format', async () => {
      const userWithInvalidEmail = new User({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      });

      let error;
      try {
        await userWithInvalidEmail.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    test('should enforce username length constraints', async () => {
      // Test minimum length
      const userWithShortUsername = new User({
        username: 'ab', // less than 3 characters
        email: 'test@example.com',
        password: 'password123'
      });

      let error;
      try {
        await userWithShortUsername.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();

      // Test maximum length
      const userWithLongUsername = new User({
        username: 'a'.repeat(31), // more than 30 characters
        email: 'test@example.com',
        password: 'password123'
      });

      try {
        await userWithLongUsername.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.username).toBeDefined();
    });

    test('should enforce password length constraints', async () => {
      const userWithShortPassword = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345' // less than 6 characters
      });

      let error;
      try {
        await userWithShortPassword.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    test('should enforce role constraints', async () => {
      const userWithInvalidRole = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid-role'
      });

      let error;
      try {
        await userWithInvalidRole.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.role).toBeDefined();
    });

    test('should enforce unique username constraint', async () => {
      const user1 = new User({
        username: 'testuser',
        email: 'test1@example.com',
        password: 'password123'
      });

      await user1.save();

      const user2 = new User({
        username: 'testuser', // same username
        email: 'test2@example.com',
        password: 'password123'
      });

      let error;
      try {
        await user2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });

    test('should enforce unique email constraint', async () => {
      const user1 = new User({
        username: 'testuser1',
        email: 'test@example.com',
        password: 'password123'
      });

      await user1.save();

      const user2 = new User({
        username: 'testuser2',
        email: 'test@example.com', // same email
        password: 'password123'
      });

      let error;
      try {
        await user2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });
  });

  describe('Password Hashing', () => {
    test('should hash password before saving', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();
      expect(savedUser.password).not.toBe('password123');
      expect(savedUser.password).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/); // bcrypt hash pattern
    });

    test('should not hash password if not modified', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();
      const originalHash = savedUser.password;

      // Update non-password field
      savedUser.username = 'updateduser';
      await savedUser.save();

      expect(savedUser.password).toBe(originalHash);
    });

    test('should hash password when password is modified', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();
      const originalHash = savedUser.password;

      // Update password
      savedUser.password = 'newpassword123';
      await savedUser.save();

      expect(savedUser.password).not.toBe(originalHash);
      expect(savedUser.password).not.toBe('newpassword123');
    });
  });

  describe('Instance Methods', () => {
    test('should compare password correctly', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();

      const isCorrectPassword = await user.comparePassword('password123');
      const isWrongPassword = await user.comparePassword('wrongpassword');

      expect(isCorrectPassword).toBe(true);
      expect(isWrongPassword).toBe(false);
    });

    test('should update login info correctly', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();

      const originalLoginCount = user.loginCount;
      const originalLastLogin = user.lastLogin;

      await user.updateLoginInfo();

      expect(user.loginCount).toBe(originalLoginCount + 1);
      expect(user.lastLogin).toBeInstanceOf(Date);
      expect(user.lastLogin.getTime()).toBeGreaterThan(originalLastLogin?.getTime() || 0);
    });

    test('should update logout info correctly', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();

      const originalLastLogout = user.lastLogout;

      await user.updateLogoutInfo();

      expect(user.lastLogout).toBeInstanceOf(Date);
      expect(user.lastLogout.getTime()).toBeGreaterThan(originalLastLogout?.getTime() || 0);
    });
  });

  describe('Static Methods', () => {
    test('should find user by email', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();

      const foundUser = await User.findByEmail('test@example.com');
      expect(foundUser).toBeDefined();
      expect(foundUser._id.toString()).toBe(user._id.toString());

      const notFoundUser = await User.findByEmail('nonexistent@example.com');
      expect(notFoundUser).toBeNull();
    });

    test('should find user by email case-insensitively', async () => {
      const user = new User({
        username: 'testuser',
        email: 'Test@Example.com',
        password: 'password123'
      });

      await user.save();

      const foundUser = await User.findByEmail('test@example.com');
      expect(foundUser).toBeDefined();
      expect(foundUser._id.toString()).toBe(user._id.toString());
    });
  });

  describe('Virtual Properties', () => {
    test('should return user profile without password', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });

      await user.save();

      const profile = user.profile;

      expect(profile).toBeDefined();
      expect(profile.password).toBeUndefined();
      expect(profile.username).toBe('testuser');
      expect(profile.email).toBe('test@example.com');
      expect(profile.role).toBe('admin');
      expect(profile._id).toBeDefined();
    });
  });

  describe('Database Operations', () => {
    test('should create and save user', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // should be hashed
    });

    test('should find user by ID', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const savedUser = await user.save();
      const foundUser = await User.findById(savedUser._id);

      expect(foundUser).toBeDefined();
      expect(foundUser._id.toString()).toBe(savedUser._id.toString());
    });

    test('should update user', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { username: 'updateduser' },
        { new: true }
      );

      expect(updatedUser.username).toBe('updateduser');
    });

    test('should delete user', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();
      const userId = user._id;

      await User.findByIdAndDelete(userId);

      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();
    });

    test('should find users with filters', async () => {
      const user1 = new User({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
        role: 'user'
      });

      const user2 = new User({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
        role: 'admin'
      });

      await user1.save();
      await user2.save();

      const adminUsers = await User.find({ role: 'admin' });
      const regularUsers = await User.find({ role: 'user' });

      expect(adminUsers).toHaveLength(1);
      expect(regularUsers).toHaveLength(1);
      expect(adminUsers[0].username).toBe('user2');
      expect(regularUsers[0].username).toBe('user1');
    });
  });

  describe('Data Integrity', () => {
    test('should trim whitespace from username and email', async () => {
      const user = new User({
        username: '  testuser  ',
        email: '  test@example.com  ',
        password: 'password123'
      });

      await user.save();

      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
    });

    test('should convert email to lowercase', async () => {
      const user = new User({
        username: 'testuser',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      });

      await user.save();

      expect(user.email).toBe('test@example.com');
    });

    test('should set default values correctly', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();

      expect(user.role).toBe('user');
      expect(user.isActive).toBe(true);
      expect(user.loginCount).toBe(0);
      expect(user.lastLogin).toBeNull();
      expect(user.lastLogout).toBeNull();
    });

    test('should set timestamps correctly', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user.save();

      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBeGreaterThan(0);
      expect(user.updatedAt.getTime()).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle validation errors gracefully', async () => {
      const invalidUser = new User({});

      let error;
      try {
        await invalidUser.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe('ValidationError');
      expect(Object.keys(error.errors)).toContain('username');
      expect(Object.keys(error.errors)).toContain('email');
      expect(Object.keys(error.errors)).toContain('password');
    });

    test('should handle duplicate key errors', async () => {
      const user1 = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      await user1.save();

      const user2 = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      let error;
      try {
        await user2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    });
  });
});
