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
      voteConfig {
        voteLevel
        voteQqVip
        file {
          fileFullPath
        }
      }
    }
  }
`

export const readOne = gql`
  query readOne($id: ID!) {
    data: vote(id: $id) {
      id
      voteName
      voteType
      specialType
      hasReward
      rewardContent
      ruleContent
      startTime
      endTime
      createBy
      status
      roundStage {
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
      voteConfig {
        voteLevel
        voteQqVip
        showMap
        showChart
        voteShowType
        voteUpdateType
        diyBg
        file {
          fileFullPath
        }
      }
    }
  }
`

export const readOnePart = gql`
  query readOnePart($id: ID!) {
    data: vote(id: $id) {
      id
      voteName
      voteType
      specialType
      hasReward
      rewardContent
      ruleContent
      startTime
      endTime
      createBy
      status
      voteRoleType {
        id
        name
      }
      roundStage {
        id
        name
        startTime
        endTime
      }
      voteConfig {
        voteLevel
        voteQqVip
        showMap
        showChart
        voteShowType
        voteUpdateType
        diyBg
        file {
          fileFullPath
        }
      }
    }
  }
`

export const readCount = gql`
  query readCount($filter: VoteFilter) {
    page: voteCount(filter: $filter) {
      total
    }
  }
`
