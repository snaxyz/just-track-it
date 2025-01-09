import { ChatPromptTemplate } from "@langchain/core/prompts";

export const generateTitleFromMessageTemplate = ChatPromptTemplate.fromMessages(
  [
    [
      "system",
      "Your task is to take the user message and generate a short title for this chat. Limit the title to 200 characters. Only respond with the generated title.",
    ],
    [
      "user",
      "Generate a chat title for the following user message and only respond with the title without quotes: Hello there!",
    ],
    ["ai", "Hello there!"],
    [
      "user",
      "Generate a chat title for the following user message and only respond with the title without quotes: let's try a new chat",
    ],
    ["ai", "Exploring New Horizons: Let's Chat"],
    [
      "user",
      "Generate a chat title for the following user message and only respond with the title without quotes: {message}",
    ],
  ]
);
