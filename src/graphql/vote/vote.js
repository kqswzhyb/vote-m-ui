import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: VoteFilter) {
    data: voteList(page: $page, filter: $filter) {
      id
      voteName
      voteType
      specialType
      startTime
      endTime
      createBy
      status
      voteRoleType {
        id
        name
      }
    }
  }
`
