const AWS = require('aws-sdk');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

const s3 = new AWS.S3();

const build = async () => {
  await exec('npm install');
  await exec('BACKEND_URL=https://hyperbudget-api-staging.herokuapp.com npm run build');
}

const deployToS3 = async (name) => {
  await exec(`aws s3 cp dist s3://${name}/dist/ --recursive \
    --exclude "*.map" --include "*.js" --include "*.svg"`);
  await exec(`aws s3 cp public s3://${name}/public/ --recursive \
     --include "*"`);

  await exec(`aws s3 cp index.html s3://${name}/`);
}

const checkBucketExists = async bucketName => {
  try {
    await s3.headBucket({ Bucket: bucketName }).promise();
    return true;
  } catch (e) {
    if (e.statusCode === 404) {
      return false;
    }
    throw e;
  }
}

const allowGetAll = async (bucketName) => {
  const params = {
    Bucket: bucketName,
    Policy: JSON.stringify({
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AddPerm",
          "Effect": "Allow",
          "Principal": "*",
          "Action": ["s3:GetObject"],
          "Resource": [`arn:aws:s3:::${bucketName}/*`]
        }
      ]
    })
  };

  await s3.putBucketPolicy(params).promise();
};


const setupWebsite = async(bucketName) => {
  const params = {
    Bucket: bucketName,
    WebsiteConfiguration: {
     ErrorDocument: {
      Key: "index.html"
     },
     IndexDocument: {
      Suffix: "index.html"
     }
    }
   };

   await s3.putBucketWebsite(params).promise();
}

const createBucket = async(bucketName) => {
  let params = {
    Bucket: bucketName,
    ACL: 'public-read',
    CreateBucketConfiguration: {
      LocationConstraint: 'eu-west-2',
    },
  };

  await s3.createBucket(params).promise();
}

const emptyS3Directory = async (bucket, dir) => {
    const listParams = {
      Bucket: bucket,
      Prefix: dir
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) {
      return;
    }

    const deleteParams = {
      Bucket: bucket,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key }))
      }
    };

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

const deleteBucket = async (bucketName) => {
  var params = {
    Bucket: bucketName
  };

  await emptyS3Directory(bucketName);
  return s3.deleteBucket(params).promise();
}

const getBucketUrl = bucketName => (
  `http://${bucketName}.s3-website.eu-west-2.amazonaws.com/`
);

module.exports = {
  build, deployToS3, checkBucketExists, createBucket, getBucketUrl, allowGetAll, setupWebsite, deleteBucket
};
