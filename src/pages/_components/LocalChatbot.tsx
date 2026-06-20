import { useChatbot } from "../_hooks/useChatbot";
import { ChatHistory } from "./ChatHistory";
import SendIcon from "./SendIcon";

export default function LocalChatbot() {
  const { messages, input, setInput, status, isTyping, handleSubmit } =
    useChatbot();

  return (
    <div className="box-border flex h-full w-full flex-col rounded-lg border border-gray-300 bg-white p-4 font-sans shadow-sm">
      <ChatHistory messages={messages} status={status} isTyping={isTyping} />

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
          disabled={status !== "ready" || isTyping}
          className="flex-1 rounded-md border border-gray-300 p-3 text-base transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:bg-gray-50"
          placeholder="Escribe un mensaje..."
        />
        <button
          type="submit"
          disabled={status !== "ready" || isTyping}
          className="cursor-pointer rounded-md border-none bg-blue-600 px-5 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
}
