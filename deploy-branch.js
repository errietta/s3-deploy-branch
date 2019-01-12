const moment = require('moment');

const {
  build,
  checkBucketExists,
  deployToS3,
  createBucket,
  allowGetAll,
  setupWebsite,
  getBucketUrl,
} = require('./lib/wrappers');
const { getBucketName } = require('./lib/get-bucket-name');

const tableName = process.env['DYNAMODB_TABLE'] || 'cleanup-deploys-dev';
const ddb = require('./lib/ddb-wrapper')(tableName);

(async() => {
  console.log('building..');
  //await build();

  const name = await getBucketName();

  console.log(`name, ${name}`);

  if (await checkBucketExists(name)) {
    console.log(`bucket ${name} exists.`);
  } else {
    console.log(`creating bucket, name: ${name}`);
    await createBucket(name);
    await allowGetAll(name);
    await setupWebsite(name);
  }

  console.log('deploy to aws...');
  await deployToS3(name);

  await ddb.addToTable({
    bucket_name: name,
    delete_after: +moment().add(10, 'minutes').format('x')
  });

  console.log(`use ${getBucketUrl(name)}`);

  //console.log('deleting bucket...');
  //await emptyS3Directory(name);
  //await deleteBucket();
})();
