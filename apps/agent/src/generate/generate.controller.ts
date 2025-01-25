import { Body, Controller, Post } from "@nestjs/common";
import { GenerateService } from "./generate.service";

interface GenerateWorkoutDto {
  generateId: string;
  userId: string;
  message: string;
}

@Controller("generate")
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post("workout")
  async generateWorkout(@Body() { generateId, userId, message }: GenerateWorkoutDto) {
    return this.generateService.generateWorkout(generateId, userId, message);
  }
}
