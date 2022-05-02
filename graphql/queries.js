/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      name
      description
      devices
      createdAt
      updatedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        devices
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCanData = /* GraphQL */ `
  query GetCanData($id: ID!) {
    getCanData(id: $id) {
      id
      deviceID
      Signal
      PhysicalValue
      createdAt
      updatedAt
    }
  }
`;
export const listCanData = /* GraphQL */ `
  query ListCanData(
    $filter: ModelCanDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCanData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        deviceID
        Signal
        PhysicalValue
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!) {
    getDevice(id: $id) {
      id
      CSSId
      Location
      Vehicle
      isAcive
      PostID
      DateActivated
      createdAt
      updatedAt
    }
  }
`;
export const listDevices = /* GraphQL */ `
  query ListDevices(
    $filter: ModelDeviceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDevices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        CSSId
        Location
        Vehicle
        isAcive
        PostID
        DateActivated
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
