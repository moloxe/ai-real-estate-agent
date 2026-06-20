export interface Message {
  role: "user" | "assistant" | "system";
  text: string;
}
