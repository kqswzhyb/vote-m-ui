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
      userId
      voteId
      replyId
      content
      likeCount
      dislikeCount
      floor
      createdAt
    }
  }
`
