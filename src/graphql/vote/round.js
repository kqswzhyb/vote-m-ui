import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    data: roundStage(id: $id) {
      id
      name
      roleTypeId
      totalCount
      promotionCount
      startTime
      endTime
      round {
        id
        roundName
        groupName
        startTime
        endTime
        roundRole {
          id
          roleId
          isPromotion
          normalCount
          specialCount
          totalCount
          updatedAt
          voteRole {
            roleName
            alias
            description
            file {
              fileFullPath
            }
          }
        }
      }
    }
  }
`
