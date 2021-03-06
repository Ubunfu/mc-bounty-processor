const index = require('../src/index.js');
const expect = require('chai').expect;
const sinon = require('sinon');
const dbService = require('../src/db/dbService.js');
const walletService = require('../src/wallet/walletService.js');
const axios = require('axios');

const TEST_PLAYER = "whooshbokoo";
const TEST_BOUNTY = "Diamonds!";
const TEST_BOUNTY_VALUE = 99;
const TEST_DISCORD_WEBHOOK_PAYLOAD = {
    "embeds": [
        {
            "author": {
                "name": "Bounty Hunter"
            },
            "thumbnail": {
                "url": process.env.DISCORD_WEBHOOK_THUMBNAIL_URL
            },
            "title": `Bounty turned in by ${TEST_PLAYER}`,
            "color": 8421504,
            "fields": [
                {
                    "name": TEST_BOUNTY,
                    "value": TEST_BOUNTY_VALUE
                }
            ]
        }
    ]
};

describe('index: When receives bounty request event', function() {
    describe('And DB returns a matching bounty', function() {
        let dbMock = null;
        beforeEach(function() {
            dbMock = sinon.stub(dbService, "getBounty")
                .returns({
                    Item: {
                        BountyId: TEST_BOUNTY,
                        Value: TEST_BOUNTY_VALUE
                    }
                });
        });
        afterEach(function() {
            dbMock.restore();
        });

        describe('And wallet-service returns 200', function() {
            let walletMock, handlerResponse, webHookMock = null;
            beforeEach(async function() {
                walletMock = sinon.stub(walletService, "pay")
                    .returns({
                        statusCode: '200'
                    });
                webHookMock = sinon.stub(axios, "post").returns(null);
                handlerResponse = await index.handler({
                    body: `{"player": "${TEST_PLAYER}", "achievement": "${TEST_BOUNTY}"}`
                });
            });
            afterEach(function() {
               walletMock.restore();
               webHookMock.restore();
            });

            it('Should return 200 status code', function() {
                expect(handlerResponse.statusCode).to.be.equal('200');
            });

            it('Should pay player', function() {
                expect(walletMock.calledOnceWith(`${TEST_PLAYER}`, TEST_BOUNTY_VALUE)).to.be.true;
            });

            it('Should post notification to Discord', function() {
                expect(webHookMock.calledOnce).to.be.true;
                expect(webHookMock.lastCall.args[1]).to.be.deep.equal(TEST_DISCORD_WEBHOOK_PAYLOAD);
            });
        });

        describe('And wallet-service returns error', function() {
            let walletMock, handlerResponse = null;
            beforeEach(async function() {
                walletMock = sinon.stub(walletService, "pay")
                    .throws({
                        response: {
                            statusCode: '500'
                        }
                    });
                handlerResponse = await index.handler({
                    body: `{"player": "${TEST_PLAYER}", "achievment": "${TEST_BOUNTY}"}`
                });
            });
            afterEach(function() {
               walletMock.restore();
            });

            it('Should return 500 status code', function() {
                expect(handlerResponse.statusCode).to.be.equal('500');
            });
            
            it('Should return error message', function() {
                let errorResp = JSON.parse(handlerResponse.body);
                expect(errorResp.error).to.be.equal("error posting bounty payment");
            });
        });
    });

    describe('And DB does not find a matching bounty', function() {
        let dbMock, walletSpy, handlerResponse = null;
        beforeEach(async function() {
            dbMock = sinon.stub(dbService, "getBounty")
                .returns({});
            walletSpy = sinon.spy(walletService, "pay");
            handlerResponse = await index.handler({
                body: `{"player": "${TEST_PLAYER}", "achievment": "${TEST_BOUNTY}"}`
            });
        });
        afterEach(function() {
            dbMock.restore();
            walletSpy.restore();
        });

        it('Should return 400', function() {
            expect(handlerResponse.statusCode).to.be.equal('400');
        });

        it('Should return error message', function() {
            let errorResp = JSON.parse(handlerResponse.body);
            expect(errorResp.error).to.be.equal("invalid bounty");
        });

        it('Should not pay player', function() {
            expect(walletSpy.callCount).to.be.equal(0);
        });
    });
});