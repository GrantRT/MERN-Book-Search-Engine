const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');
// Bring in Apollo Server, typeDefs, resolvers and authMiddleware
const { ApolloServer } = require('apollo-server-express');

const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
// Implement ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Apply ApolloServer to Express server as middleware
// server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// routes not needed? React app will handle the routing
// app.use(routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Creating apollo server with the graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // Apply ApolloServer to Express server as middleware
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Calling the async func to start the server
startApolloServer(typeDefs, resolvers);
