// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UploadFile, Account, Device, Alert, Chart, Card, Post, CanData } = initSchema(schema);

export {
  UploadFile,
  Account,
  Device,
  Alert,
  Chart,
  Card,
  Post,
  CanData
};