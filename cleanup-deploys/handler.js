'use strict';

const moment = require('moment');

const tableName = process.env['DYNAMODB_TABLE'] || 'cleanup-deploys-dev';
const ddb = require('../lib/ddb-wrapper')(tableName);

module.exports.cleanup = async (event, context) => {
  const buckets = await ddb.filterDeleteAfter(+moment().format('x'));
  console.log(buckets);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
