async function getBounty(docClient, bounty) {
    var getParams = {
        TableName: process.env.TABLE_BOUNTIES,
        Key: {
            'BountyId': bounty
        }
    }

    try {
        return await docClient.get(getParams).promise();
    } catch (err) {
        return err;
    }
}

exports.getBounty = getBounty;