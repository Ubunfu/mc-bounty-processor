const fs = require('fs');

const TABLE_NAME = process.env.TABLE_NAME
const SCAN_OUTPUT_FILE = process.env.SCAN_OUTPUT_FILE
const BATCH_OUTPUT_FILE_PREFIX = 'bounties'

async function makeBatch() {
    const backupString = await fs.readFileSync(SCAN_OUTPUT_FILE, 'utf-8')
    const backupBounties = JSON.parse(backupString)

    let batchRequests = []
    backupBounties.forEach(backupBounty => {
        batchRequests.push({
            PutRequest: {
                Item: decorateWithDataTypes(backupBounty)
            }
        })
    })
    
    for (let batchFileIndex = 0; batchFileIndex < (batchRequests.length/25); batchFileIndex++) {
        let batchObject = {}
        batchObject[TABLE_NAME] = []
    
        for (let requestIndex = 0; requestIndex < 25; requestIndex++) {
            const overallRequestIndex = (batchFileIndex*25+requestIndex)
            if (overallRequestIndex == batchRequests.length) {
                break
            }
            batchObject[TABLE_NAME].push(batchRequests[overallRequestIndex])
        }
        await fs.writeFileSync(BATCH_OUTPUT_FILE_PREFIX+`_${batchFileIndex}.json`, JSON.stringify(batchObject), 'utf8')
    }
}

function decorateWithDataTypes(bounty) {
    // {"itemName":"Cobblestone","itemId":"minecraft:cobblestone","price":1,"sellPrice":0.05}
    bounty.BountyId = {
        S: bounty.BountyId
    }
    bounty.Value = {
        N: `${bounty.Value}`
    }
    return bounty
}

makeBatch()