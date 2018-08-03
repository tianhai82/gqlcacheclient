const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    people(gender: String): Person
  }

  interface Person {
    name: String
    age: Int
  }
  type Male implements Person {
    name: String
    age: Int
    power: Int
  }
  type Female implements Person {
    name: String
    age: Int
    beauty: Int
  }

`;
const mocks = {
  Int: () => 6,
  Float: () => 22.1,
  String: () => 'Ah Huat',
};
const server = new ApolloServer({
  typeDefs,
  mocks,

});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
