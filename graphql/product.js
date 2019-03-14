const { gql } = require('apollo-server-express');

const Product = require('../model/product');

module.exports.typeDefs = gql`
  extend type Query {
    products: [Product!]
  }

  extend type Mutation {
    createProduct(productInput: ProductInput!): Product
  }

  type Product {
    _id: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  input ProductInput {
    name: String!
    price: Float!
    quantity: Int!
  }
`;

module.exports.resolvers = {
  Query: {
    products: async (_, __, { isAuth }) => {
      if (!isAuth) {
        throw new Error('Access Denied');
      }

      return await Product.find();
    }
  },

  Mutation: {
    createProduct: async (_, { productInput }, { isAuth }) => {
      if (!isAuth) {
        throw new Error('Access Denied');
      }

      const product = new Product({
        name: productInput.name,
        price: productInput.price,
        quantity: productInput.quantity
      });

      const result = await product.save();

      return { ...result._doc, _id: result.id };
    }
  }
};
