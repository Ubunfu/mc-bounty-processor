require('dotenv').config();
const dbService = require('./db/dbService.js');
const { log } = require('./util/logger.js');
const walletService = require('./wallet/walletService.js');
const AWS = require ('aws-sdk');

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = async (event, context) => {
    await log('Received event: ' + JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    const bounty = JSON.parse(event.body).achievement;
    const player = JSON.parse(event.body).player;
    const docClient = new AWS.DynamoDB.DocumentClient();
    var bountyValue;
    
    try {
        let bountyRecord = await dbService.getBounty(docClient, bounty);
        await log("db returned: " + JSON.stringify(bountyRecord));
        
        bountyValue = await bountyRecord.Item.Value;
        await log("bounty is: " + bountyRecord.Item.Value);
    } catch (err) {
        statusCode = '400';
        body = {
            error: "invalid bounty",
            errorDetail: err.message
        };
    }

    try {
        if (statusCode == '200') {
            await walletService.pay(player, bountyValue);
        }
    } catch (err) {
        log(err);
        statusCode = '500';
        body = {
            error: "error posting bounty payment",
            errorDetail: `${err.response}`
        };
    }

    body = JSON.stringify(body);
    return {
        statusCode,
        body,
        headers,
    };
};