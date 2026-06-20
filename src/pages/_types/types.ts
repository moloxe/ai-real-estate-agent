export interface Message {
  role: "user" | "assistant" | "system";
  text: string;
  image?: string; // data URL for attached images
}
