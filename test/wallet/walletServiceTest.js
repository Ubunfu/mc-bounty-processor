const walletService = require('../../src/wallet/walletService.js');
const axios = require('axios');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('walletService: When wallet service call returns HTTP 200', function() {
    let walletResp, axiosMock = null;
    beforeEach(async function() {
        axiosMock = sinon.stub(axios, "post")
            .returns({
                status: 200,
                data: 'walletResponse'
            });
        walletResp = await walletService.pay("whooshbokoo", 100);
    });
    afterEach(function() {
        axiosMock.restore();
    });

    it('Should return response data', function() {
        expect(walletResp.data).to.be.equal('walletResponse')
    });
});

describe('walletService: When wallet service returns HTTP error', function() {
    let walletResp, axiosMock = null;
    beforeEach(function() {
        axiosMock = sinon.stub(axios, "post")
            .throws({response: {status: 500}});
    });
    afterEach(function() {
        axiosMock.restore();
    });
    
    it('Should return error', async function() {
        walletResp = await walletService.pay("whooshbokoo", 10);
        expect(walletResp.response.status).to.be.equal(500);
    });
});