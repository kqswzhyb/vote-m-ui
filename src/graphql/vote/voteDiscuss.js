import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: VoteDiscussFilter) {
    data: voteDiscussList(page: $page, filter: $filter) {
      id
      voteId
      userId
      user {
        nickname
        file {
          fileFullPath
        }
      }
      replyId
      signalType
      voteDiscuss {
        id
        voteId
        userId
        user {
          nickname
          file {
            fileFullPath
          }
        }
        replyId
        signalType
        content
        likeCount
        dislikeCount
        floor
        createdAt
      }
      content
      likeCount
      dislikeCount
      floor
      createdAt
    }
  }
`

export const readCount = gql`
  query readCount($filter: VoteDiscussFilter) {
    data: voteDiscussCount(filter: $filter) {
      total
    }
  }
`

export const createVoteDiscuss = gql`
  mutation createVoteDiscuss($input: CreateVoteDiscussInput!) {
    data: createVoteDiscuss(input: $input) {
      id
      voteId
      userId
      user {
        nickname
        file {
          fileFullPath
        }
      }
      replyId
      signalType
      voteDiscuss {
        id
        voteId
        userId
        user {
          nickname
          file {
            fileFullPath
          }
        }
        replyId
        signalType
        content
        likeCount
        dislikeCount
        floor
        createdAt
      }
      content
      likeCount
      dislikeCount
      floor
      createdAt
    }
  }
`

export const createVoteDiscussSignal = gql`
  mutation createVoteDiscussSignal($input: CreateVoteDiscussSignalInput!) {
    data: createVoteDiscussSignal(input: $input) {
      id
      userId
      voteDiscussId
      signalType
      createdAt
    }
  }
`

export const deleteVoteDiscussSignal = gql`
  mutation deleteVoteDiscussSignal($id: ID!) {
    deleteVoteDiscussSignal(id: $id) {
      code
      message
    }
  }
`