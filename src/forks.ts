import { GET_STATS } from "./queries";

export const forks = [
    {
      name: "OHM",
      graphUri: "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph",
      query: GET_STATS[0]

    },
    {
      name: "EXOD",
      graphUri:
        "https://api.thegraph.com/subgraphs/name/exodiafinance/exodia-subgraph",
      query: GET_STATS[2]
    },
    {
      name: "SPA",
      graphUri: "https://api.thegraph.com/subgraphs/name/spartacus-finance/ftm2",
      query: GET_STATS[0]
    },
    {
      name: "HEC",
      graphUri: "https://api.thegraph.com/subgraphs/name/wkich/hector-subgraph",
      query: GET_STATS[1]
    }
  ];