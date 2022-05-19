/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
      id
      name
      description
      devices
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
      id
      name
      description
      devices
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
      id
      name
      description
      devices
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCanData = /* GraphQL */ `
  subscription OnCreateCanData {
    onCreateCanData {
      id
      deviceID
      Signal
      PhysicalValue
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateCanData = /* GraphQL */ `
  subscription OnUpdateCanData {
    onUpdateCanData {
      id
      deviceID
      Signal
      PhysicalValue
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteCanData = /* GraphQL */ `
  subscription OnDeleteCanData {
    onDeleteCanData {
      id
      deviceID
      Signal
      PhysicalValue
      createdAt
      updatedAt
    }
  }
`;
export const onCreateDevice = /* GraphQL */ `
  subscription OnCreateDevice {
    onCreateDevice {
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
export const onUpdateDevice = /* GraphQL */ `
  subscription OnUpdateDevice {
    onUpdateDevice {
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
export const onDeleteDevice = /* GraphQL */ `
  subscription OnDeleteDevice {
    onDeleteDevice {
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
