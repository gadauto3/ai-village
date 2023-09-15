# App Deployment to AWS

## Overview

This example deploys a React app frontend and NodeJS backend to AWS, in their respective folders.

The deployment consists of 2 steps:
- Pre-requisites (compile frontend and backend)
- Deployment (deploy to AWS)

Both steps are detailed below.

## Pre-Requisites

Read [this Medium article](https://medium.com/@kurianoff/deploy-serverless-react-app-with-node-js-express-backend-to-aws-with-terraform-in-under-15-minutes-2386bf0c58e9) to understand [the repository](https://github.com/terraformita/terraform-aws-serverless-app/tree/main/examples/simple) on which this project is based.

Make sure you sign up for [an OpenAI account](https://platform.openai.com/signup?launch) and get an API key by setting up a small budget. To give you a baseline, the entire process before this commit cost me 25¢.

Make sure you have an AWS account. Terraform will spin up all the necessary services so make sure your user has full privileges. The one manual resource is a Parameter Store key-value pair for your OpenAI API key with the path: "/aivillage/apikeys/openai". [See this pic](./paramStore.png) for configuration details.

### Compile Frontend

Run the following commands to initialize and compile frontend.

- Initialize frontend
```
cd frontend
npm init -y
```

- Compile React App
```
npx babel src --out-dir public/js --presets react-app/prod
```

### Compile Backend
Note: the backend must be in a "nodejs" directory due to deployment to AWS Lambda.

- Initialize backend
```
cd backend/nodejs
npm init -y
```

## Deployment

- Run `terraform apply` to deploy application to AWS. The output will look like this:

```
deployment = {
  "auth_endpoint" = ""
  "aws_url" = "https://nqav0yhr9b.execute-api.us-east-1.amazonaws.com/dev"
  "custom_domain_url" = ""
  "execution_arn" = "arn:aws:execute-api:us-east-1:990617134998:nqav0yhr9b"
  "stage" = "dev"
  "user_role_arn" = "arn:aws:iam::990617134998:role/adapted-gnu-api_gateway-role"
}
frontend_storage = {
  "arn" = "arn:aws:s3:::adapted-gnu-dev-gui"
  "id" = "adapted-gnu-dev-gui"
}
```

- The "aws_url" field from the output is an URL where the app is deployed: `https://nqav0yhr9b.execute-api.us-east-1.amazonaws.com/dev` from the above, where `/dev` is a "stage" (e.g. "dev", "staging", "prod", etc).

## Enjoy the App

Open "aws_url" in your web browser and see the app in action.

## Development

In order to speed up development, I have written a series of scripts and aliases:

```
cd application
source scripts/bashrc
```
You can put these into your bashrc file, though I had trouble integrating into VSCode's terminals, so just sourced these when needed. Scripts expect to be run from the applications directory.

```
tfa
```
terraform apply - deploy the application

```
tfd
```
terraform destroy - destroy the application

```
deployFrontEnd.sh
```
This is a shortcut to run the npx command above to package the frontend then call terraform apply

```
startLocalFrontEnd.sh
```
Start the frontend locally, really useful for adjusting the UI.

```
testBackEnd.sh
```
Run unittests on the backend
