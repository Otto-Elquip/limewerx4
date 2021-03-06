// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ReferenceData, UploadFile, Account, Device, Alert, Chart, Card, Post, CanData } = initSchema(schema);

export {
  ReferenceData,
  UploadFile,
  Account,
  Device,
  Alert,
  Chart,
  Card,
  Post,
  CanData
};