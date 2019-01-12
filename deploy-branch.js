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

(async() => {
  console.log('building..');
  await build();

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

  console.log(`use ${getBucketUrl(name)}`)

  //console.log('deleting bucket...');
  //await emptyS3Directory(name);
  //await deleteBucket();
})();
