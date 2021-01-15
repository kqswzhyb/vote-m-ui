import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    data: user(id: $id) {
      id
      username
      createdAt
    }
  }
`
