const fs = require("fs");
const path = require("path");
const { Credentials, ExecutionContext } = require("@adobe/pdfservices-node-sdk");

const credsJson = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../pdfservices-api-credentials.json"),
    "utf-8"
  )
);

const credentials = Credentials.servicePrincipalCredentialsBuilder()
  .withClientId(credsJson.client_credentials.client_id)
  .withClientSecret(credsJson.client_credentials.client_secret)
  .build();

const executionContext = ExecutionContext.create(credentials);

module.exports = {
  credentials,
  executionContext
};