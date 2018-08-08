import GqlClient from '../src/index';

const fetch = require('node-fetch');

global.fetch = fetch;

test('variable in query itself', done => {
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
    done();
  }).catch(err => console.log(err));
});

test('variable sent separately', done => {
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
    done();
  }).catch(err => console.log(err));
});

test('error handler returning data', done => {
  let status = 0;
  const client = new GqlClient('http://localhost:4000/graphql', { reject: 'true' }, (err) => {
    if (err.networkError.status) {
      const data = { x: 1, status: err.networkError.status };
      return data;
    }
    throw err;
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
    expect(data.x).toBe(1);
    expect(data.status).toBe(401);
    done();
  }).catch(err => console.log('error catch', err));
});
test('error handler throwing network error', done => {
  let status = 0;
  const client = new GqlClient('http://localhost:4000/graphql', { reject: 'true' }, (err) => {
    if (err.networkError.status) {
      throw err.networkError;
    }
    throw err;
  });
  return client.request(`query x($gender:String){
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
    console.log('fail', data);
    expect(1).toBe(2);
  }).catch(err => {
    expect(err).toEqual({ statusText: 'Unauthorized', status: 401 })
    done();
  });
});
test('error handler rejecting promise', done => {
  let status = 0;
  const client = new GqlClient('http://localhost:4000/graphql', { reject: 'true' }, (err) => {
    if (err.networkError.status === 401) {
      return Promise.reject(err.networkError);
    } else {
      return err.response;
    }
  });
  return client.request(`query x($gender:String){
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
    console.log('fail', data);
    expect(1).toBe(2);
  }).catch(err => {
    expect(err).toEqual({ statusText: 'Unauthorized', status: 401 })
    done();
  });
});
test('error handler throwing graphqlErrors', done => {
  let status = 0;
  const client = new GqlClient('http://localhost:4000/graphql', { reject: 'false' }, (err) => {
    if (err.networkError && err.networkError.status && err.networkError.status === 401) {
      return Promise.reject(err.networkError);
    } else if (err.graphqlErrors) {
      throw err.graphqlErrors;
    }
  });
  return client.request(`query x($gender:String){
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
  }`, { gender: 'femal' }).then((data) => {
    expect(1).toBe(2);
  }).catch(err => {
    expect(err.length).toBe(1);
    expect(err[0].message).toBe('invalid argument received');
    done();
  });
});
test('complex input', done => {
  const client = new GqlClient('http://localhost:4000/graphql', { reject: 'false' });
  return client.request(`query complex($input:PersonInput!){
    peopleSpecific(input: $input) {
      name
      age
      ... on Male {
        x:power
      }
      ... on Female {
        beauty
      }
    }
  }`, { input: { gender: 'female', age: 18 } }).then((data) => {
    expect(data).toEqual({ peopleSpecific: { age: 18, name: 'Ah Huat', beauty: 999 } });
    done();
  }).catch(err => {
    console.log(err);
    expect(1).toBe(2);
  });
});
