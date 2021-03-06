const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Get single user by the logged in users id
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }
      throw new AuthenticationError('Please log in');
    },
  },
  Mutation: {
    // Create a user
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    // Login a user
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong Password!');
      }

      const token = signToken(user);

      return { token, user };
    },
    // Save a book to a users 'savedBooks'
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate({ _id: context.user._id }, { $addToSet: { savedBooks: args.input } }, { new: true, runValidators: true });
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Remove a book from a user 'savedBooks'
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate({ _id: context.user._id }, { $pull: { savedBooks: { bookId: args.bookId } } }, { new: true });
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
