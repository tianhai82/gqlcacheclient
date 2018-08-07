import GqlClient from '../src/index';

const fetch = require('node-fetch');

global.fetch = fetch;

test('variable in query itself', () => {
  const client = new GqlClient('http://localhost:4000/graphql');
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

test('variable sent separately', () => {
  const client = new GqlClient('http://localhost:4000/graphql');
  client.request(`query x($gender:String!){
    people(gender: $gender) {
      name
      age
      ... on Male {
        x:power
      }
      ... on Female {
        beauty
      }
    }
  }`, { gender: 'male' }).then((data) => {
    expect(data.people.name).toBe('Ah Huat');
    expect(data.people.age).toBe(6);
  }).catch(err => console.log(err));
});

test('error handler', () => {
  let status = 0;
  const client = new GqlClient('http://localhost:4000/graphql', { reject: 'true' }, (err) => {
    status = err.response.status;
    return true;
  });
  client.request(`query x($gender:String){
    people(gender: $gender) {
      name
      age
      ... on Male {
        x:power
      }
      ... on Female {
        beauty
      }
    }
  }`, { gender: 'female' }).then((data) => {
    expect(status + 'haha').toBe('401haha');
    console.log(status);
    if (data && data.people) {
      expect(data.people.name).toBe('Ah Huat');
      expect(data.people.age).toBe(6);
    }
  }).catch(err => console.log('error catch', err));
});
