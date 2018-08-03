import GqlClient from '../src/index';

const fetch = require('node-fetch');

global.fetch = fetch;
const client = new GqlClient('http://localhost:4000');
test('gql query', () => {
  client.request(`{
    people(gender: "male") {
      name
      age
      ... on Male {
        x:power
      }
      ... on Female {
        beauty
      }
    }
  }
  
  `).then((data) => {
    expect(data.people.name).toBe('Ah Huat');
    expect(data.people.age).toBe(6);
  }).catch(err => console.log(err));
});
