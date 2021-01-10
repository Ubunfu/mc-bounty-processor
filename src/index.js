require('dotenv').config();
const dbService = require('./db/dbService.js');
const { log } = require('./util/logger.js');
const walletService = require('./wallet/walletService.js');
const AWS = require ('aws-sdk');
const axios = require('axios');

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
            try {
                await axios.post(
                    process.env.DISCORD_WEBHOOK_URL,
                    await buildDiscordPayload(player, bounty, bountyValue)
                );
            } catch (err) {
                log('Error sending notification to Discord: ' + err);
            }
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

async function buildDiscordPayload(player, bounty, bountyValue) {
    return {
        "embeds": [
            {
                "author": {
                    "name": "Bounty Hunter"
                },
                "thumbnail": {
                    "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
                },
                "title": `Bounty turned in by ${player}`,
                "color": 8421504,
                "fields": [
                    {
                        "name": `${bounty}`,
                        "value": bountyValue
                    }
                ]
            }
        ]
    }
}