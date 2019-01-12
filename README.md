# s3-deploy-branch

Deploys the current branch of a repository to s3 (website mode), giving the bucket the user's name and name of branch (so for example `errietta-test`). There are some hardcoded things in `lib/wrappers.js` right now about which branches are deployed, and I also put my pet project's name in the branch so may need some tweaking.

You could then test your branch in an online environment, e.g. for qa.

The s3 buckets are then destroyed after an hour using a lambda that listens for cloudwatch events.

## Install

```
npm install
sls deploy # to set up the 'clean up' function
```

## Usage
`node /path/to/deploy-branch.js` - you should get a url for your branch.
It will be gone after 1hr.

You can force deletion of a bucket with:
`node /path/to/delete-bucket.js`
