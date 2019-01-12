const { getBucketName } = require('./lib/get-bucket-name');
const { checkBucketExists, deleteBucket } = require ('./lib/wrappers');

(async () => {
  const name = process.argv[2] || await getBucketName();
  console.log(name);
  if (await checkBucketExists(name)) {
    await deleteBucket(name);
    console.log('deleted');
  } else {
    console.log(`${name} does not exist, probably has been deleted`);
  }
})();
