import { Config } from "@/config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export interface Connection {
  userId: string;
  connectionId: string;
  createdAt: string;
}

export class ConnectionsStore {
  private tableName: string;
  private client: DynamoDBDocument;

  constructor(config: Config) {
    this.client = DynamoDBDocument.from(new DynamoDBClient());
    this.tableName = config.dynamo.connectionsTable;
  }

  async addConnection(userId: string, connectionId: string): Promise<void> {
    await this.client.put({
      TableName: this.tableName,
      Item: {
        pk: `USER#${userId}#CONNECTIONS`,
        sk: `CONNECTION#${connectionId}`,
        userId,
        connectionId,
        createdAt: new Date(Date.now()).toISOString(),
      },
    });
  }

  async removeConnection(userId: string, connectionId: string): Promise<void> {
    await this.client.delete({
      TableName: this.tableName,
      Key: {
        pk: `USER#${userId}#CONNECTIONS`,
        sk: `CONNECTION#${connectionId}`,
      },
    });
  }

  async getConnection(userId: string, connectionId: string): Promise<Connection | null> {
    const response = await this.client.get({
      TableName: this.tableName,
      Key: {
        pk: `USER#${userId}#CONNECTIONS`,
        sk: `CONNECTION#${connectionId}`,
      },
    });

    return response.Item as Connection | null;
  }

  async getUserConnections(userId: string): Promise<Connection[]> {
    const response = await this.client.query({
      TableName: this.tableName,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}#CONNECTIONS`,
        ":sk": "CONNECTION#",
      },
    });

    return response.Items as Connection[];
  }

  async getAllUsers(): Promise<string[]> {
    const response = await this.client.scan({
      TableName: this.tableName,
      ProjectionExpression: "userId",
    });

    return [...new Set(response.Items?.map((item) => item.userId) || [])];
  }
}
