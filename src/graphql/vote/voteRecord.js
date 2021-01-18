import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: VoteRecordFilter) {
    data: voteRecordList(page: $page, filter: $filter) {
      id
      roundRoleId
      roundRole {
          voteRole {
              roleName
          }
      }
      voteType
      isExtra
    }
  }
`

export const batchCreateVoteRecord = gql`
  mutation batchCreateVoteRecord($input: [CreateVoteRecordInput]!) {
    data:batchCreateVoteRecord(input: $input) {
      code
      message
    }
  }
`
