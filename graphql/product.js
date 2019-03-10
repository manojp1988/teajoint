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
  }

  input ProductInput {
    name: String!
    price: Float!
  }
`;

module.exports.resolvers = {
  Query: {
    products: async () => {
      return await Product.find();
    }
  },

  Mutation: {
    createProduct: async (_, { productInput }) => {
      const product = new Product({
        name: productInput.name,
        price: productInput.price
      });

      const result = await product.save();

      return { ...result._doc, _id: result.id };
    }
  }
};
