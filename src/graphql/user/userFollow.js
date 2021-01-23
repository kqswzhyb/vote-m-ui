import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    data: userFollow(id: $id) {
      id
      userId
      followId
      followType
      createdAt
    }
  }
`

export const readAll = gql`
  query readAll($filter: UserFollowFilter) {
    data: userFollowList(filter: $filter) {
      id
      userId
      followId
      followType
      follow {
        __typename
        ... on Vote {
          id
          voteName
          voteType
          specialType
          startTime
          endTime
          voteConfig {
            voteLevel
            voteQqVip
            voteShowType
            voteUpdateType
            diyBg
            file {
              fileFullPath
            }
          }
          status
        }
        ... on User {
          id
          username
          nickname
          qqLevel
          qqVip
          file {
            fileFullPath
          }
        }
      }
      createdAt
    }
  }
`

export const readCount = gql`
  query readCount($filter: UserFollowFilter) {
    data: userFollowCount(filter: $filter) {
      total
    }
  }
`

export const createUserFollow = gql`
  mutation createUserFollow($input: CreateUserFollowInput!) {
    data: createUserFollow(input: $input) {
      id
      userId
      followId
      followType
      createdAt
    }
  }
`

export const deleteUserFollow = gql`
  mutation deleteUserFollow($id: ID!) {
    data: deleteUserFollow(id: $id) {
      code
      message
    }
  }
`
