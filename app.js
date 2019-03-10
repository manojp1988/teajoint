const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/schema');
const mongoose = require('mongoose');

const server = new ApolloServer({
  schema
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds117681.mlab.com:17681/${
      process.env.MONGO_DB
    }`,
    { useNewUrlParser: true }
  )
  .then(() => {
    app.listen({ port: process.env.PORT }, () =>
      console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
    );
  })
  .catch(err => {
    console.log(err);
  });
