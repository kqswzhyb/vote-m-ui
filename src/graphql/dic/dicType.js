import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: DicTypeFilter) {
    data: dicTypeList(page: $page, filter: $filter) {
      id
      name
      code
      remark
      dic {
        id
        name
        value
        remark
      }
    }
  }
`
