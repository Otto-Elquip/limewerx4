/* eslint-disable */
// this is an auto generated file. This will be overwritten
export const createCard = /* GraphQL */ `
  mutation CreateCard(
    $input: CreateCardInput!
    $condition: ModelCardConditionInput
  ) {
    createCard(input: $input, condition: $condition) {
      id
      CSSId
      type
      title
      period
      signal
      unit
      isDisplayed
    }
  }
`;
export const deleteCard = /* GraphQL */ `
  mutation DeleteCard(
    $input: DeleteCardInput!
    $condition: ModelCardConditionInput
  ) {
    deleteCard(input: $input, condition: $condition) {
      id
    }
  }
`;

export const updateCard = /* GraphQL */ `
  mutation UpdateCard(
    $input: UpdateCardInput!
    $condition: ModelCardConditionInput
  ) {
    updateCard(input: $input, condition: $condition) {
      id
      CSSId
      type
      title
      period
      isDisplayed
      signal
      createdAt
      updatedAt
    }
  }
`;

export const updateChart = /* GraphQL */ `
  mutation UpdateChart(
    $input: UpdateChartInput!
    $condition: ModelChartConditionInput
  ) {
    updateChart(input: $input, condition: $condition) {
      id
      type
      title
      period
      isDisplayed
      signal
      CSSId
      filter
      createdAt
      updatedAt
    }
  }
`;


export const updateAlert = /* GraphQL */ `
  mutation UpdateAlert(
    $input: UpdateAlertInput!
    $condition: ModelAlertConditionInput
  ) {
    updateAlert(input: $input, condition: $condition) {
      id
      type
      title
      period
      isDisplayed
      signal
      condition
      threshold
      deviceID
      createdAt
      updatedAt
    }
  }
`;

export const createAlert = /* GraphQL */ `
  mutation CreateAlert(
    $input: CreateAlertInput!
    $condition: ModelAlertConditionInput
  ) {
    createAlert(input: $input, condition: $condition) {
      id
      type
      title
      period
      isDisplayed
      signal
      condition
      threshold
      deviceID
    }
  }
`;

export const createAccount = /* GraphQL */ `
  mutation CreateAccount(
    $input: CreateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    createAccount(input: $input, condition: $condition) {
      CognitoUserName
      AccountName
      EmailAddr
      AuthLvl
      BusinessName
    }
  }
`;


export const createChart = /* GraphQL */ `
  mutation CreateChart(
    $input: CreateChartInput!
    $condition: ModelChartConditionInput
  ) {
    createChart(input: $input, condition: $condition) {
      id
      type
      title
      period
      isDisplayed
      signal
      CSSId
      filter
    }
  }
`;

export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      name
      description
      devices
      createdAt
      updatedAt
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      name
      description
      devices
      createdAt
      updatedAt
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      name
      description
      devices
      createdAt
      updatedAt
    }
  }
`;
export const createCanData = /* GraphQL */ `
  mutation CreateCanData(
    $input: CreateCanDataInput!
    $condition: ModelCanDataConditionInput
  ) {
    createCanData(input: $input, condition: $condition) {
      id
      deviceID
      Signal
      PhysicalValue
      createdAt
      updatedAt
    }
  }
`;
export const createUploadFile = /* GraphQL */ `
  mutation CreateUploadFile(
    $input: CreateUploadFileInput!
    $condition: ModelUploadFileConditionInput
  ) {
    createUploadFile(input: $input, condition: $condition) {
      id
      FileName
      UploadedBy
      deviceID
    }
  }
`;
export const updateCanData = /* GraphQL */ `
  mutation UpdateCanData(
    $input: UpdateCanDataInput!
    $condition: ModelCanDataConditionInput
  ) {
    updateCanData(input: $input, condition: $condition) {
      id
      deviceID
      Signal
      PhysicalValue
      createdAt
      updatedAt
    }
  }
`;
export const deleteCanData = /* GraphQL */ `
  mutation DeleteCanData(
    $input: DeleteCanDataInput!
    $condition: ModelCanDataConditionInput
  ) {
    deleteCanData(input: $input, condition: $condition) {
      id
      deviceID
      Signal
      PhysicalValue
      createdAt
      updatedAt
    }
  }
`;
export const createDevice = /* GraphQL */ `
  mutation CreateDevice(
    $input: CreateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    createDevice(input: $input, condition: $condition) {
      id
      CSSId
      Location
      Vehicle
      isAcive
      DateActivated
      accountID
      createdAt
      updatedAt
    }
  }
`;

export const updateUploadFile = /* GraphQL */ `
  mutation UpdateUploadFile(
    $input: UpdateUploadFileInput!
    $condition: ModelUploadFileConditionInput
  ) {
    updateUploadFile(input: $input, condition: $condition) {
      id
      FileName
      UploadedBy
      deviceID
      isDeleted
    }
  }
`;

export const updateDevice = /* GraphQL */ `
  mutation UpdateDevice(
    $input: UpdateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    updateDevice(input: $input, condition: $condition) {
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
export const deleteDevice = /* GraphQL */ `
  mutation DeleteDevice(
    $input: DeleteDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    deleteDevice(input: $input, condition: $condition) {
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
