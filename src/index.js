import { parse } from 'graphql';

function recurseFields(field, variables) {
  if (field.kind.toLowerCase() === 'field') {
    let key = field.name.value;
    if (field.alias) {
      key = `${field.alias.value}:${key}`;
    }
    const argKeys = field.arguments.map((arg) => {
      let argKey = arg.name.value;
      if (
        arg.value.kind.toLowerCase() === 'variable'
        && variables
        && arg.value.name
        && variables[arg.value.name.value]
      ) {
        argKey += `=${variables[arg.value.name.value]}`;
      } else if (arg.value.kind.toLowerCase() !== 'variable') {
        argKey += `=${arg.value.value}`;
      }
      return argKey;
    });
    if (argKeys.length > 0) {
      key += `(${argKeys.join(' ')})`;
    }
    if (
      !field.selectionSet
      || !field.selectionSet.selections
      || field.selectionSet.selections.length === 0
    ) {
      return key;
    }
    const fieldsKey = field.selectionSet.selections
      .map(f => recurseFields(f, variables))
      .join(' ');
    return `${key}{${fieldsKey}}`;
  }
  if (field.kind.toLowerCase() === 'inlinefragment') {
    const key = `...${field.typeCondition.name.value}`;
    if (
      !field.selectionSet
      || !field.selectionSet.selections
      || field.selectionSet.selections.length === 0
    ) {
      return key;
    }
    const fieldsKey = field.selectionSet.selections
      .map(f => recurseFields(f, variables))
      .join(' ');
    return `${key}{${fieldsKey}}`;
  }
  throw new Error('Selection is of unknown type');
}

function getCacheKey(doc, variables) {
  const outer = [];
  outer.push(doc.operation);
  outer.push(doc.name ? doc.name.value : null);
  const key = outer.join('|');

  return doc.selectionSet.selections.map((sel) => {
    if (sel.kind.toLowerCase() === 'field') {
      const alias = sel.alias ? sel.alias.value : sel.name.value;
      const queryKey = `${key}|${recurseFields(sel, variables)}`;
      return {
        queryKey,
        alias,
      };
    }
    throw new Error('First level selections must be of kind "Field"');
  });
}

function fetchQuery(endpoint, headers, operationName, query, variables) {
  return fetch(endpoint, {
    method: 'POST',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify({
      operationName,
      query,
      variables,
    }),
  })
    .then(response => response.json())
    .then((data) => {
      if (data.errors && data.errors.length > 0) {
        return Promise.reject(data.errors);
      }
      return Promise.resolve(data.data);
    });
}

export default class GqlClient {
  constructor(endpoint, headers) {
    this.endpoint = endpoint;
    this.headers = headers;
    this.cache = new Map();
  }

  request(query, variables, options) {
    let reqOptions = {
      cache: true,
    };
    if (options) {
      reqOptions = { ...reqOptions, ...options };
    }
    let queryDoc;
    try {
      queryDoc = parse(query);
      if (queryDoc.definitions.length > 1) {
        return Promise.reject(new Error('Multiple operations not supported'));
      }
    } catch (e) {
      return Promise.reject(e);
    }
    const doc = queryDoc.definitions[0];
    let cacheKeys;
    if (reqOptions.cache && doc.operation.toLowerCase() === 'query') {
      try {
        cacheKeys = getCacheKey(doc, variables);
      } catch (e) {
        return Promise.reject(e);
      }
      const result = {};
      let count = 0;
      cacheKeys.forEach((key) => {
        const cached = this.cache.get(key.queryKey);
        if (cached) {
          result[key.alias] = cached;
          count += 1;
        }
      });
      if (count === cacheKeys.length) {
        return Promise.resolve(result);
      }
    }
    return fetchQuery(
      this.endpoint,
      this.headers,
      queryDoc.definitions[0].name ? queryDoc.definitions[0].name.value : null,
      query,
      variables,
    ).then((data) => {
      if (
        reqOptions.cache
        && doc.operation.toLowerCase() === 'query'
        && cacheKeys
      ) {
        cacheKeys.forEach((key) => {
          this.cache.set(key.queryKey, data[key.alias]);
        });
      }
      return Promise.resolve(data);
    });
  }
}
