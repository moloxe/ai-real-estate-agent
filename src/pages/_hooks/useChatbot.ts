import { useState, useEffect, useRef } from "react";
import type { Message } from "../_types/types";
import { PRE_PROMPTS } from "../_constants/pre-prompts";

declare global {
  interface Window {
    LanguageModel: any;
  }
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "unavailable">(
    "checking",
  );
  const [isTyping, setIsTyping] = useState(false);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    async function initAI() {
      if (!("LanguageModel" in window)) {
        setStatus("unavailable");
        return;
      }

      try {
        const availability = await window.LanguageModel.availability({
          expectedInputs: [{ type: "text", languages: ["es", "en"] }],
          expectedOutputs: [{ type: "text", languages: ["es"] }],
        });

        if (availability !== "unavailable") {
          sessionRef.current = await window.LanguageModel.create({
            expectedOutputs: [{ type: "text", languages: ["es"] }],
            initialPrompts: [
              {
                role: "system",
                content: PRE_PROMPTS,
              },
            ],
          });
          setStatus("ready");
        } else {
          setStatus("unavailable");
        }
      } catch (error) {
        console.error("Error al inicializar LanguageModel:", error);
        setStatus("unavailable");
      }
    }

    initAI();

    return () => {
      if (sessionRef.current) {
        sessionRef.current.destroy();
      }
    };
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready" || !sessionRef.current) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sessionRef.current.prompt(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    } catch (error) {
      console.error("Error en la inferencia:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error procesando el mensaje." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    status,
    isTyping,
    handleSubmit,
  };
}
