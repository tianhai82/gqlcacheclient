# gqlcacheclient

📡 A Simple and Minimalistic JS GraphQL caching client for the browsers

## Features

* **simple and lightweight** GraphQL client
* Promise-based API (works with `async` / `await`)


## Install

```sh
npm install gqlcacheclient
yarn add gqlcacheclient
```

## Quickstart

```js
import GqlClient = 'gqlcacheclient'

const query = `{
  Movie(title: "Inception") {
    releaseDate
    actors {
      name
    }
  }
}`

const client = new GqlClient('https://api.graph.cool/simple/v1/movies')
client.request(query).then(data => console.log(data))

```
Results will be cached based on the query, fields and arguments. When you make a second query for less fields than the first query, a new query will be made to the server. All fields and arguments must match for the query to return data from the cache.

## Usage

```js
import GqlClient = 'gqlcacheclient'

const headers = {
  'Content-Type': 'application/graphql',
  credentials: 'same-origin',
};

// errHandler allows you to handle errors before rethrowing the errors. If no error is rethrown,
//   the request will resolve with the data returned from this errHandler.
//   Otherwise, the request be able to catch the error rethrown
//   Check for networkError or graphqlError in the (err) parameter
const errHandler = (err) => {
    // check for networkError or graphqlError and handle them
    if (err.networkError.status === 401){
        // forward to login page
    }
    throw err; //rethrow err
}
const client = new GqlClient('https://api.graph.cool/simple/v1/movies',headers, errHandler)
// if no header is provided, the default will be {'Content-Type': 'application/json; charset=utf-8'}

const query = `query getMovie($title: String!) {
  Movie(title: $title) {
    releaseDate
    actors {
      name
    }
  }
}`

const variables = {
  title: 'Inception',
}

// currently, options takes only { cache: true } or { cache: false }
const options = {
  cache: true // default is true
};

client.request(query, variables, options)
  .then(data => console.log(data))
  .catch(err => {
    console.log(err) // handle errors
  })
```

## FAQ

### Does it support inline fragment?

Yes!


### Does it support fragment?

Not yet.
