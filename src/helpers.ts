import { ApolloClient, InMemoryCache } from "@apollo/client";
  export function createApolloClient(graphUri) {
    const cache = new InMemoryCache();
    const client = new ApolloClient({
      uri: graphUri,
      cache,
    });
    return client;
  }