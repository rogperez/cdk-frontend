import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deployment from '@aws-cdk/aws-s3-deployment';
import * as cf from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

import * as path from 'path';

export interface InfrastructureStackProps extends cdk.StackProps {
  readonly zoneDomainName: string;
  readonly uiSubdomain: string;
}

export class InfrastructureStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: InfrastructureStackProps
  ) {
    super(scope, id, props);

    const uiFqdn = `${props.uiSubdomain}.${props.zoneDomainName}`;

    const bucket = new s3.Bucket(this, 'StaticWebsiteExampleBucket', {
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    });

    const hostedZone = route53.HostedZone.fromLookup(
      this,
      'RogerWSHostedZone',
      {
        domainName: props.zoneDomainName,
      }
    );

    const certificate = new acm.DnsValidatedCertificate(
      this,
      'StaticWebsiteExampleCertificate',
      {
        hostedZone: hostedZone,
        domainName: uiFqdn,
      }
    );

    const deployment = new s3Deployment.BucketDeployment(
      this,
      'DeployStaticWebsiteExample',
      {
        destinationBucket: bucket,
        sources: [
          s3Deployment.Source.asset(path.join('..', 'frontend', 'build')),
        ],
      }
    );

    const distribution = new cf.Distribution(
      this,
      'StaticWebsiteExampleDistribution',
      {
        defaultBehavior: { origin: new origins.S3Origin(bucket) },
        domainNames: [uiFqdn],
        certificate: certificate,
      }
    );

    new route53.ARecord(this, 'StaticWebsiteExampleARecord', {
      zone: hostedZone,
      recordName: uiFqdn,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
    });
  }
}
