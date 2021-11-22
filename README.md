# Messembed Node.js SDK

![Messembed Logo](https://github.com/Messembed/node-messembed-sdk/raw/main/readme-hero.jpg)

# Installation
```bash
npm install --save messembed-sdk
```
or
```bash
yarn add messembed-sdk
```

# Usage
## Client SDK
```ts
import { MessembedSDK } from 'messembed-sdk'

const messembedSdk = new MessembedSDK({
  baseUrl: '<URL to the Messembed service>', // required
  accessToken: '<access token for your user>', // required
});

```
For the list of methods look at the documentation: https://docs.messembed.com/api/client-api 

## Admin SDK
```ts
import { MessembedAdminSDK } from 'messembed-sdk'

const messembedSdk = new MessembedAdminSDK({
  baseUrl: '<URL to the Messembed service>', // required
  username: '<any non-empty string that describes your service>', // required
  password: '<the admin password>', // required
});

```
For the list of methods look at the documentation: https://docs.messembed.com/api/server-api/node.js-sdk 
