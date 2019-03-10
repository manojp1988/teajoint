const { gql } = require('apollo-server-express');
const _ = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');

const { typeDefs: User, resolvers: userResolvers } = require('./user.js');
const { typeDefs: Product, resolvers: productResolvers } = require('./product.js');

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const resolvers = {};

module.exports = makeExecutableSchema({
  typeDefs: [typeDefs, User, Product],
  resolvers: _.merge(resolvers, userResolvers, productResolvers)
});
