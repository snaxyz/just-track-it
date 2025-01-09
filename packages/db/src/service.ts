import { drizzleClient } from "./client";
import {
  ChatMessageRepository,
  ChatRepository,
  ExerciseRepository,
  SettingRepository,
  WorkoutExerciseRepository,
  WorkoutRepository,
  WorkoutSessionExerciseRepository,
  WorkoutSessionRepository,
} from "./repositories";
import { createSampleWorkouts } from "./sample-data/create-sample-workouts";
import { eq } from "drizzle-orm";
import {
  exercise,
  workout,
  workoutSession,
  setting,
  chatMessage,
  chat,
} from "./schema";

export class DatabaseService {
  drizzleClient = drizzleClient;

  exercise: ExerciseRepository;
  setting: SettingRepository;
  workout: WorkoutRepository;
  workoutSession: WorkoutSessionRepository;
  workoutExercise: WorkoutExerciseRepository;
  workoutSessionExercise: WorkoutSessionExerciseRepository;
  chat: ChatRepository;
  chatMessage: ChatMessageRepository;

  constructor() {
    this.exercise = new ExerciseRepository(drizzleClient);
    this.setting = new SettingRepository(drizzleClient);
    this.workout = new WorkoutRepository(drizzleClient);
    this.workoutSession = new WorkoutSessionRepository(drizzleClient);
    this.workoutExercise = new WorkoutExerciseRepository(drizzleClient);
    this.workoutSessionExercise = new WorkoutSessionExerciseRepository(
      drizzleClient
    );
    this.chat = new ChatRepository(drizzleClient);
    this.chatMessage = new ChatMessageRepository(drizzleClient);
  }

  async insertSampleWorkouts(userId: string) {
    await createSampleWorkouts(this, userId);
  }

  async deleteUserData(userId: string) {
    // Delete in order to respect foreign key constraints
    // workout_session_exercise and workout_exercise will be deleted automatically due to CASCADE
    await drizzleClient.transaction(async (tx) => {
      // Delete all workout sessions
      await tx.delete(workoutSession).where(eq(workoutSession.userId, userId));

      // Delete all workouts
      await tx.delete(workout).where(eq(workout.userId, userId));

      // Delete all exercises
      await tx.delete(exercise).where(eq(exercise.userId, userId));

      // Delete chat
      await tx.delete(chatMessage).where(eq(chatMessage.userId, userId));
      await tx.delete(chat).where(eq(chat.userId, userId));

      // Delete settings
      await tx.delete(setting).where(eq(setting.userId, userId));
    });
  }
}
