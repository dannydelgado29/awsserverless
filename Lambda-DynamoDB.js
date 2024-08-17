import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "<YOUR DYANAMODB TABLE NAME>";

export const handler = async (event, context) => {

  const eventBody = JSON.parse(event.body);

  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (eventBody.routeKey) {
      case "DELETE":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: eventBody.id,
            },
          })
        );
        body = `Deleted item ${eventBody.id}`;
        break;
      case "GET":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: eventBody.id,
            },
          })
        );
        body = body.Item;
        break;
      case "GETALL":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
      case "PUT":
        let requestJSON = eventBody;
        delete eventBody.routeKey;
        
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item:  {
              id: requestJSON.id,
              price: requestJSON.price,
              name: requestJSON.name,
            },
          })
        );
        body = `Put item ${requestJSON.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${eventBody.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
