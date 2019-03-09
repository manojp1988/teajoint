const { gql } = require('apollo-server');
const _ = require('lodash');
const { typeDefs: User, resolvers: userResolvers } = require('./user.js');
const { makeExecutableSchema } = require('graphql-tools');

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
  typeDefs: [typeDefs, User],
  resolvers: _.merge(resolvers, userResolvers)
});
