const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const typeDefs = gql`
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
    input PersonInput {
        age: Int!
        gender: String!
    }
    type Query {
        people(gender: String): Person
        peopleSpecific(input:PersonInput!): Person
    }
`;
// const mocks = {
//   Int: () => 6,
//   Float: () => 22.1,
//   String: () => 'Ah Huat',
// };
const resolvers = {
  Query: {
    people: (parent, args, context, info) => {
      switch (args.gender) {
        case 'male':
          return {
            name: 'Ah Huat',
            age: 6,
            power: 99,
          };
        case 'female':
          return {
            name: 'Ah Huat',
            age: 6,
            beauty: 999,
          };
        default:
          throw new Error("invalid argument received");
      }
    },
    peopleSpecific: (parent, args, context, info) => {
      switch (args.input.gender) {
        case 'male':
          return {
            name: 'Ah Huat',
            age: args.input.age,
            power: 99,
          };
        case 'female':
          return {
            name: 'Ah Huat',
            age: args.input.age,
            beauty: 999,
          };
        default:
          throw new Error("invalid argument received");
      }
    },
  },
  Person: {
    __resolveType: (a) => {
      if (a.power) return 'Male';
      if (a.beauty) return 'Female';
      return 'Person';
    }
  }
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
var app = express()
var myLogger = function (req, res, next) {
  if (req.headers.reject === 'true') {
    console.log('rejecting');
    res.status(401).send('NotAuthenticated')
    return;
  }
  next()
}

app.use(myLogger)
app.get('/', function (req, res) {
  console.log('huat');
  res.send('Hello World!');
})

server.applyMiddleware({ app })
app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready`);
});
