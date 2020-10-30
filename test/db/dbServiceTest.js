const sinon = require('sinon');
const dbService = require('../../src/db/dbService.js');
const expect = require('chai').expect;

describe('dbService: When database returns a record', function() {
    let dbServiceResp = null;
    beforeEach(async function() {
        const mockDocClient = {
            get: sinon.stub().returnsThis(),
            promise: sinon.stub().resolves({
                Item: {
                    BountyId: 'an item', 
                    Value: 5
                }})
        };
        dbServiceResp = await dbService.getBounty(mockDocClient, "an item");
    });

    it('Should return the same record', function() {
        expect(dbServiceResp.Item.Value).to.be.equal(5);
    });
});

describe('dbService: When database returns an error', function() {
    let dbServiceResp = null;
    beforeEach(async function() {
        const mockDocClient = {
            get: sinon.stub().throwsException("error")
        }
        dbServiceResp = await dbService.getBounty(mockDocClient, "an item");
    });

    it('Should return the error', function() {
        expect(dbServiceResp.name).to.be.equal("error");
    })
});