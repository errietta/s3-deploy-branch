const AWS = require('aws-sdk');

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
    getItem(item) {
      return new Promise((resolve, reject) => (
        client.get(
          {
            TableName: table,
            Key: item,
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
    },
  };
}};

module.exports = dbdWrapper;
