# mc-bounty-processor
[![Latest Release](https://img.shields.io/github/v/release/Ubunfu/mc-bounty-processor)](https://github.com/Ubunfu/mc-bounty-processor/releases)
[![codecov](https://codecov.io/gh/Ubunfu/mc-bounty-processor/branch/master/graph/badge.svg?token=K1YOPWSEQD)](https://codecov.io/gh/Ubunfu/mc-bounty-processor)
[![CircleCI](https://img.shields.io/circleci/build/github/Ubunfu/mc-bounty-processor?logo=circleci)](https://app.circleci.com/pipelines/github/Ubunfu/mc-bounty-processor)
![Contrubutors](https://img.shields.io/github/contributors/Ubunfu/mc-bounty-processor?color=blue)
![Last Commit](https://img.shields.io/github/last-commit/Ubunfu/mc-bounty-processor)

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
| DISCORD_WEBHOOK_URL | Discord webhook URL used to post notifications when bounties are turned in.      | n/a     | Yes       |
| DISCORD_WEBHOOK_THUMBNAIL_URL | URL of a thumbnail image to use for the Discord notification.          | n/a     | Yes       |