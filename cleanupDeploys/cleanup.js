const moment = require('moment');

const tableName = process.env['DYNAMODB_TABLE'] || 'cleanup-deploys-dev';
const ddb = require('../lib/ddb-wrapper')(tableName);
const { checkBucketExists, deleteBucket } = require ('../lib/wrappers');


const getBucketsToDelete = async () => {
  return (await ddb.filterDeleteAfter(+moment().format('x'))).Items;
}

const doCleanup = async (buckets) => {
  await Promise.all(buckets.map(bucket => (
    checkBucketExists(bucket.bucket_name).then(exists => (
      exists && deleteBucket(bucket.bucket_name)
    ))
  )));

  await Promise.all(buckets.map(bucket => (
    ddb.deleteItem({ bucket_name: bucket.bucket_name })
  )));
};

module.exports = { doCleanup, getBucketsToDelete };

(async() => {
  await cleanup();
})()
