# Description

Create a simple s3 bucket, CloudFront distribution and connect it all with a domain name and certificate.

# Getting Started

## Building the Frontend

This project uses [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app).

```
cd frontend
yarn install
yarn build
```

## Building the Infrastructure

Before building the infrastructure, you must [build the frontend](#building-the-frontend).

```
cd infrastructure
yarn cdk synth -c account_id=12345 -c zome_domain_name=foo.com --profile my-aws-profile
yarn cdk deploy -c account_id=12345 -c zome_domain_name=foo.com --profile my-aws-profile
```
