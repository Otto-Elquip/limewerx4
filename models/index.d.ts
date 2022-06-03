import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type UploadFileMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type AccountMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DeviceMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type AlertMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChartMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CardMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PostMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CanDataMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class UploadFile {
  readonly id: string;
  readonly FileName?: string | null;
  readonly UploadedBy?: string | null;
  readonly deviceID: string;
  readonly isDeleted?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<UploadFile, UploadFileMetaData>);
  static copyOf(source: UploadFile, mutator: (draft: MutableModel<UploadFile, UploadFileMetaData>) => MutableModel<UploadFile, UploadFileMetaData> | void): UploadFile;
}

export declare class Account {
  readonly id: string;
  readonly CognitoUserName: string;
  readonly AccountName: string;
  readonly EmailAddr: string;
  readonly AuthLvl: number;
  readonly BusinessName?: string | null;
  readonly Devices?: (Device | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Account, AccountMetaData>);
  static copyOf(source: Account, mutator: (draft: MutableModel<Account, AccountMetaData>) => MutableModel<Account, AccountMetaData> | void): Account;
}

export declare class Device {
  readonly id: string;
  readonly CSSId: string;
  readonly Location?: string | null;
  readonly Vehicle?: string | null;
  readonly isAcive: boolean;
  readonly DateActivated: string;
  readonly Alerts?: (UploadFile | null)[] | null;
  readonly accountID: string;
  readonly UploadFiles?: (UploadFile | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Device, DeviceMetaData>);
  static copyOf(source: Device, mutator: (draft: MutableModel<Device, DeviceMetaData>) => MutableModel<Device, DeviceMetaData> | void): Device;
}

export declare class Alert {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly period: string;
  readonly isDisplayed: boolean;
  readonly signal: string;
  readonly condition: string;
  readonly threshold: string;
  readonly deviceID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Alert, AlertMetaData>);
  static copyOf(source: Alert, mutator: (draft: MutableModel<Alert, AlertMetaData>) => MutableModel<Alert, AlertMetaData> | void): Alert;
}

export declare class Chart {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly period: string;
  readonly isDisplayed: boolean;
  readonly signal: string;
  readonly CSSId: string;
  readonly filter: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Chart, ChartMetaData>);
  static copyOf(source: Chart, mutator: (draft: MutableModel<Chart, ChartMetaData>) => MutableModel<Chart, ChartMetaData> | void): Chart;
}

export declare class Card {
  readonly id: string;
  readonly CSSId: string;
  readonly type: string;
  readonly title: string;
  readonly period: string;
  readonly isDisplayed: boolean;
  readonly signal?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Card, CardMetaData>);
  static copyOf(source: Card, mutator: (draft: MutableModel<Card, CardMetaData>) => MutableModel<Card, CardMetaData> | void): Card;
}

export declare class Post {
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly devices?: string[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}

export declare class CanData {
  readonly id: string;
  readonly deviceID: string;
  readonly Signal: string;
  readonly PhysicalValue: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<CanData, CanDataMetaData>);
  static copyOf(source: CanData, mutator: (draft: MutableModel<CanData, CanDataMetaData>) => MutableModel<CanData, CanDataMetaData> | void): CanData;
}