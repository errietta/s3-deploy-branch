'use strict';

const { getBucketsToDelete, doCleanup } = require('./cleanup');

module.exports.cleanup = async (event, context) => {
  const buckets = await getBucketsToDelete();

  console.log(`buckets to delete`, buckets);

  await doCleanup(buckets);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'OK',
      input: event,
    }),
  };
};
