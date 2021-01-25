import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: VoteRecordFilter) {
    data: voteRecordList(page: $page, filter: $filter) {
      id
      roundRoleId
      voteId
      vote{
        voteName
      }
      roundStageId
      roundId
      round {
        roundName
      }
      roundRole {
        voteRole {
          roleName
          file {
            fileFullPath
          }
        }
      }
      createdAt
      voteType
      isExtra
    }
  }
`

export const readCount = gql`
  query readCount($filter: VoteRecordFilter) {
    data: voteRecordCount(filter: $filter) {
      total
    }
  }
`

export const batchCreateVoteRecord = gql`
  mutation batchCreateVoteRecord($input: [CreateVoteRecordInput]!) {
    data: batchCreateVoteRecord(input: $input) {
      code
      message
    }
  }
`
