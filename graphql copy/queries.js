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

export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        CognitoUserName
        AccountName
        EmailAddr
        AuthLvl
        BusinessName
      }
      nextToken
    }
  }
`;

export const listUploadFiles = /* GraphQL */ `
  query ListUploadFiles(
    $filter: ModelUploadFileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUploadFiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        FileName
        UploadedBy
        deviceID
        _version
        isDeleted
        createdAt
      }
      nextToken
    }
  }
`;

export const listCards = /* GraphQL */ `
  query ListCards(
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        title
        period
        signal
        isDisplayed
        unit
        _version
      }
      nextToken
    }
  }
`;
export const getCard = /* GraphQL */ `
  query GetCard($id: ID!) {
    getCard(id: $id) {
      id
      type
      title
      period
      signal
      isDisplayed
    }
  }
`;

export const listCharts = /* GraphQL */ `
  query ListCharts(
    $filter: ModelChartFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCharts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        title
        period
        signal
        filter
        isDisplayed
        _version
      }
      nextToken
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


export const listAlerts = /* GraphQL */ `
  query ListAlerts(
    $filter: ModelAlertFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAlerts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        signal
        deviceID
        threshold
        title
        type
        condition
        period
        isDisplayed
        id
        _version
        createdAt
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
        accountID
        DateActivated
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
