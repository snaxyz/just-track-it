import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import {
  ExerciseRepository,
  WorkoutRepository,
  SettingRepository,
  WorkoutHistoryRepository,
} from "./repositories";

export class DatabaseService {
  exercise: ExerciseRepository;
  setting: SettingRepository;
  workout: WorkoutRepository;
  workoutHistory: WorkoutHistoryRepository;

  constructor() {
    const dynamoClient = new DynamoDBClient({
      region: process.env.AWS_REGION!,
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              sessionToken: process.env.AWS_SESSION_TOKEN,
            }
          : undefined,
      endpoint: process.env.DYNAMO_ENDPOINT!,
    });

    const client = DynamoDBDocument.from(dynamoClient);
    const tableName = process.env.DYNAMO_TABLE_NAME!;

    this.exercise = new ExerciseRepository(client, tableName);
    this.setting = new SettingRepository(client, tableName);
    this.workout = new WorkoutRepository(client, tableName);
    this.workoutHistory = new WorkoutHistoryRepository(client, tableName);
  }
}
