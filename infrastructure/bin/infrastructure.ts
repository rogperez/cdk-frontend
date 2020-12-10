#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const app = new cdk.App();

const ACCOUNT_ID = app.node.tryGetContext('account_id');
const ZONE_DOMAIN_NAME = app.node.tryGetContext('zone_domain_name');

new InfrastructureStack(app, 'InfrastructureStack', {
  env: {
    account: ACCOUNT_ID,
    region: 'us-east-1',
  },
  zoneDomainName: ZONE_DOMAIN_NAME,
  uiSubdomain: 'ui',
});
