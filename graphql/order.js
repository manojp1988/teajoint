const { gql } = require('apollo-server-express');
const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');

const mongoose = require('mongoose');
const DataLoader = require('dataloader');

module.exports.typeDefs = gql`
  extend type Query {
    orders: [Order!]
  }

  type Order {
    _id: ID!
    date: String!
    user: User!
    product: Product!
    quantity: Int!
    totalCost: Float!
  }

  input OrderInput {
    date: String!
    userId: ID!
    productId: ID!
    quantity: Int!
  }

  extend type Mutation {
    createOrders(orderInput: OrderInput!): Order!
  }
`;

productLoader = new DataLoader(productIds => {
  return Product.find({ _id: { $in: productIds } });
});

userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

transformOrder = order => ({
  ...order._doc,
  product: product.bind(this, order._doc.productId),
  user: user.bind(this, order._doc.userId)
});

user = async userId => {
  return await userLoader.load(userId.toString());
};

product = async productId => {
  return await productLoader.load(productId.toString());
};

module.exports.resolvers = {
  Query: {
    orders: async () => {
      try {
        const orders = await Order.find();
        return orders.map(transformOrder);
      } catch (err) {
        throw err;
      }
    }
  },
  Mutation: {
    createOrders: async (_, { orderInput }) => {
      try {
        const userResult = await User.findById(orderInput.userId);
        if (!userResult) {
          throw new Error('Invalid User');
        }

        const productResult = await Product.findById(orderInput.productId);

        if (!productResult) {
          throw new Error('Invalid Product');
        }

        if (productResult.quantity <= 0) {
          throw new Error('Product is out of stock');
        }

        if (orderInput.quantity > productResult.quantity) {
          throw new Error(
            'Requested Quantity not available. We have only ' + productResult.quantity
          );
        }

        const order = new Order({
          date: new Date(orderInput.date),
          userId: orderInput.userId,
          productId: orderInput.productId,
          quantity: orderInput.quantity,
          totalCost: productResult.price * orderInput.quantity
        });

        const result = await order.save();

        const newProductResult = {
          ...productResult._doc,
          quantity: productResult._doc.quantity - orderInput.quantity
        };

        await Product.updateOne({ _id: orderInput.productId }, newProductResult);

        return transformOrder(result);
      } catch (err) {
        throw err;
      }
    }
  }
};
