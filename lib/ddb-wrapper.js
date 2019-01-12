const AWS = require('aws-sdk');

AWS.config.update({
  region: 'eu-west-2'
});

const dbdWrapper = table => {{
  const client = new AWS.DynamoDB.DocumentClient();

  return {
    addToTable(item) {
      const params = {
        TableName: table,
        Item: item
      };

      return new Promise((resolve, reject) => (
        client.put(params, (err, data) => err ? reject(err) : resolve(data))
      ));
    },
    filterDeleteAfter(date) {
      return new Promise((resolve, reject) => (
        client.scan(
          {
            TableName: table,
            FilterExpression: '#delete <= :after',
            ExpressionAttributeNames: {
              '#delete': 'delete_after'
            },
            ExpressionAttributeValues: {
              ':after': date
            }
          },
          (err, data) => err ? reject(err) : resolve(data)
        )
      ));
    },
    deleteItem(item) {
      return new Promise((resolve, reject) => (
        client.delete(
          {
            TableName: table,
            Key: item,
          },
          (err, data) => err ? reject(err) : resolve(data)
        )
      ));
    }
  };
}};

module.exports = dbdWrapper;
