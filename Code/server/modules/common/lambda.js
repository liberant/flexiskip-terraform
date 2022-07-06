const logger = require('./log');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
const { awsConfig } = require('../../config');

async function sendSMS({...message}) {
    console.log(message);
    try {
       const client = new LambdaClient({region: awsConfig.region});
        const params = {
            FunctionName: 'PostCollectionRating',
            Payload: JSON.stringify({ body: {
                    to: message.to,
                    url: message.url
                }
            })
        };
        logger.info('Going to send sms with message: ', params);
        const send = new InvokeCommand(params);
        const res = await client.send(send);
        logger.info(res);
    } catch (error) {
        logger.error('An error occurred while sending sms:', error);
    }
}

async function sendTestSMS(message) {
        const params =  {
        FunctionName: 'PostCollectionRating',
        Payload: JSON.stringify({ body: {
                to: message.to,
                url: message.url
            }
        })
    };
    return sendSMS(params);
}
module.exports = {
    sendSMS,
    sendTestSMS,
};
