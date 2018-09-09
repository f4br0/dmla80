var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing products into DynamoDB. Please wait.");

var allProducts = JSON.parse(fs.readFileSync('productData.json', 'utf8'));
allProducts.forEach(function (product) {
    var params = {
        TableName: "Products",
        Item: {
            "id": product.id,
            "name": product.name,
            "value": product.value
        }
    };

    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add product", product.name, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", product.name);
        }
    });
});