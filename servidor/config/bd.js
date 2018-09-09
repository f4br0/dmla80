
var AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient;