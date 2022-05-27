// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Account, Device, Alert, Chart, Card, Post, CanData } = initSchema(schema);

export {
  Account,
  Device,
  Alert,
  Chart,
  Card,
  Post,
  CanData
};