import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($filter: UserMessageFilter) {
    data: userMessageList(filter: $filter) {
      id
      title
      content
      url
      status
      createdAt
    }
  }
`

export const readCount = gql`
  query readCount($filter: UserMessageFilter) {
    data: userMessageCount(filter: $filter) {
      total
    }
  }
`

export const updateUserMessage = gql`
  mutation updateUserMessage($id: ID!, $input: UpdateUserMessageInput!) {
    data: updateUserMessage(id: $id, input: $input) {
      id
      title
      content
      url
      status
      createdAt
    }
  }
`
