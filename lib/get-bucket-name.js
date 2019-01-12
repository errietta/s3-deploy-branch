const util = require('util');
const exec = util.promisify(require('child_process').exec);

const getBucketName = async () => {
  const user = (await exec('whoami')).stdout.trim();
  const branches = (await exec(`git branch`)).stdout.trim();


  const branch = branches
                 .split("\n")
                 .find(branch => branch[0] === '*')
                 .replace("*","")
                 .trim();

  return `hbfe-${user}-${branch}`;
}

module.exports = { getBucketName };
