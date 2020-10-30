# mc-bounty-processor
Processes bounty requests submitted by [mc-bounty-scraper](https://github.com/Ubunfu/mc-bounty-scraper).  Valid bounties will be awarded by submitting a request to the [mc-wallet](https://github.com/Ubunfu/mc-wallet) service.

This service runs as an AWS lambda function.

## Configuration
### IAM Role
AWS's standard IAM role for Lambda micro services is plenty sufficient. The only access that is required is read/write for DynamoDB, and write to CloudWatch logs.

* AWSLambdaMicroserviceExecutionRole
* AWSLambdaBasicExecutionRole

### Environment Variables
| Parameter          | Description                                                                       | Default | Required? |
|--------------------|-----------------------------------------------------------------------------------|---------|-----------|
| TABLE_BOUNTIES     | The name of a DynamoDB table containing valid bounties and their values.          | n/a     | Yes       |
| SERVICE_WALLET_URL | The full URL of the mc-wallet payment service.                                    | n/a     | Yes       |
| LOGGER_ENABLED     | Boolean value controlling writing of logs. Useful to turn off for test execution. | n/a     | Yes       |