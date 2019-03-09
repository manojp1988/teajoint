const { ApolloServer } = require('apollo-server');
const schema = require('./graphql/schema');
const mongoose = require('mongoose');

const server = new ApolloServer({
  schema
});

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds117681.mlab.com:17681/${
      process.env.MONGO_DB
    }`,
    { useNewUrlParser: true }
  )
  .then(async r => {
    const connection = await server.listen({ port: 3000 });
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  })
  .catch(err => {
    console.log(err);
  });
