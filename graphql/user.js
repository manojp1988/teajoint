const { gql } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

const typeDefs = gql`
  extend type Query {
    users: [User!]
    login(email: String!, password: String!): String!
  }

  extend type Mutation {
    createUser(userInput: UserInput!): User
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    age: Int!
    address: Address
  }

  input UserInput {
    name: String!
    password: String!
    email: String!
    age: Int!
    address: AddressInput
  }

  type Address {
    street: String!
    city: String!
  }

  input AddressInput {
    street: String!
    city: String!
  }
`;

const resolvers = {
  Query: {
    users: async (_, __, { isAuth, user }) => {
      if (!isAuth) {
        throw new Error('Access Denied');
      }
      return await User.find();
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('Invalid User');
      }

      const isAMatch = await bcrypt.compare(password, user.password);
      if (!isAMatch) {
        throw new Error('Invalid username/password combination!');
      }

      return jwt.sign(
        { name: user.name, age: user.age, email: user.email },
        process.env.TOKEN_KEY,
        { expiresIn: '1h' }
      );
    }
  },
  Mutation: {
    createUser: async (_, args, { isAuth }) => {
      if (!isAuth) {
        throw new Error('Access Denied');
      }

      const user = new User({
        name: args.userInput.name,
        password: await bcrypt.hash(args.userInput.password, 12),
        age: args.userInput.age,
        email: args.userInput.email,
        address: args.userInput.address
      });

      try {
        const existingUserResult = await User.findOne({ email: args.userInput.email });

        if (existingUserResult) {
          throw new Error('User already exists');
        }

        const result = await user.save();

        return { ...result._doc, password: null };
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  }
};

exports.typeDefs = typeDefs;
exports.resolvers = resolvers;
