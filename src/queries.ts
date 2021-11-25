import { gql } from "@apollo/client";

export const GET_STATS = [gql`
query GetStats($userAddress: ID!) {
  ohmie(id: $userAddress) {
    lastBalance {
      sohmBalance
    }
  }
  protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
    runwayCurrent
    ohmPrice
  }
  rebases(first: 1, orderBy: timestamp, orderDirection: desc) {
    percentage
  }
  bondDiscounts(orderBy: timestamp, orderDirection: desc, first: 1) {
    dai_discount
    eth_discount
    frax_discount
    ohmlusd_discount
    ohmfrax_discount
    ohmdai_discount
    lusd_discount
  }
}`, gql`
query GetStats {
  protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
    runwayCurrent
    hecPrice
  }
  rebases(first: 1, orderBy: timestamp, orderDirection: desc) {
    percentage
  }
}`,
gql`
query GetStats($userAddress: ID!) {
  ohmie(id: $userAddress) {
    lastBalance {
      sohmBalance
    }
  }
  protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
    runwayCurrent
    ohmPrice
  }
  rebases(first: 1, orderBy: timestamp, orderDirection: desc) {
    percentage
  }
  bondDiscounts(orderBy: timestamp, orderDirection: desc, first: 1) {
    dai_discount
    eth_discount
    ohmdai_discount
  }
}`
];