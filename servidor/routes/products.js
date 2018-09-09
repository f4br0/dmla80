var express = require('express');
var router = express.Router();
var docClient = require('../config/bd')

router.get('/', function (req, res) {
    var params = {
        TableName: "Products",
        ProjectionExpression: "#id, #name, #value",
        ExpressionAttributeNames: {
            "#id": "id",
            "#name": "name",
            "#value": "value"
        }
    };
    console.log("Scanning Products table.");
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            res.send(data)
            // print all the Cars
            console.log("Scan succeeded.");
            data.Items.forEach(function (product) {
                console.log(product.id, product.name, product.value)
            });
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    }
});

router.get('/:id', function (req, res) {
    var productID = parseInt(req.params.id);
    var params = {
        TableName: "Products",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": productID
        }
    };
    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            res.send(data.Items)
            data.Items.forEach(function (product) {
                console.log(product.id, product.name, product.value);
            });
        }
    });
});

module.exports = router;