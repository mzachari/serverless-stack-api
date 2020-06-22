import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
export const main = handler(async (event, context) => {
  console.log("event.requestContext.authorizer", event.requestContext.authorizer);
  console.log("event.requestContext.authorizer.claims", event.requestContext.authorizer.claims);
  const params = {
    TableName: process.env.tableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    // partition key
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be Identity Pool identity id
    // of the authenticated user
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.authorizer.claims.sub,
    },
  };
  const result = await dynamoDb.query(params);
  // Return the matching list of items in response body
  return result.Items;
});
