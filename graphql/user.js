const { gql } = require('apollo-server-express');
const bcrypt = require('bcrypt');

const User = require('../model/user');

const typeDefs = gql`
  extend type Query {
    users: [User!]
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
    users: async () => {
      return await User.find();
    }
  },
  Mutation: {
    createUser: async (_, args, { dataSources }) => {
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
