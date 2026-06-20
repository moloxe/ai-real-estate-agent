import { marked } from "marked";
import type { Message } from "../_types/types";

const renderer = new marked.Renderer();

const parseMarkdown = (markdown: string) =>
  marked(markdown, { renderer }) as string;

interface ChatHistoryProps {
  messages: Message[];
  status: "checking" | "ready" | "unavailable";
  isTyping: boolean;
}

export function ChatHistory({ messages, status, isTyping }: ChatHistoryProps) {
  return (
    <div className="mb-4 flex flex-1 flex-col gap-3 overflow-y-auto p-2">
      {messages.length === 0 && (
        <p className="mt-4 text-center text-sm text-gray-400">
          {`[status]: ${status}`}
        </p>
      )}

      {messages.map((msg, index) => {
        const className = `max-w-[80%] rounded-lg p-3 leading-[1.4] wrap-break-word shadow-md shadow-blue-950/10`;

        if (msg.thinking) {
          return (
            <div
              key={index}
              className={`${className} mr-auto flex items-center gap-2 rounded-bl-none border border-amber-200 bg-amber-50 text-amber-800`}
            >
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
              <span className="text-sm italic">{msg.thinking}</span>
            </div>
          );
        }

        if (msg.role === "assistant") {
          return (
            <div
              key={index}
              className={`${className} mr-auto rounded-bl-none bg-gray-200 text-gray-800`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
            />
          );
        }
        return (
          <div
            key={index}
            className={`${className} ml-auto rounded-br-none bg-blue-600 text-white`}
          >
            {msg.image && (
              <img
                src={msg.image}
                alt="Imagen adjunta"
                className="mb-2 max-h-48 w-full rounded-md object-cover"
              />
            )}
            {msg.text}
          </div>
        );
      })}
      {isTyping && (
        <div className="ml-2 text-sm text-gray-500">Escribiendo...</div>
      )}
    </div>
  );
}
