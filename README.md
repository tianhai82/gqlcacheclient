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
const client = new GqlClient('https://api.graph.cool/simple/v1/movies',headers)
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
    console.log(err.response.errors) // GraphQL response errors
    console.log(err.response.data) // Response data if available
  })
```

## FAQ

### Does it support inline fragment?

Yes!


### Does it support fragment?

Not yet.
