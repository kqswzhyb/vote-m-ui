import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    data: roundRoleChart(id: $id) {
      roles {
        specialCount
        totalCount
        name
        normalCount
      }
      times
    }
  }
`