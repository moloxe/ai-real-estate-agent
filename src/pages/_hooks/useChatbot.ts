import { useState, useEffect, useRef } from "react";
import type { Message } from "../_types/types";
import { PRE_PROMPTS } from "../_constants/pre-prompts";
import ModelsNBService from "../_services/models-nb";

declare global {
  interface Window {
    LanguageModel: any;
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"checking" | "ready" | "unavailable">(
    "checking",
  );
  const [isTyping, setIsTyping] = useState(false);
  const sessionRef = useRef<any>(null);

  // Generate preview URL when image changes
  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

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

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready" || !sessionRef.current) return;

    const userMessage = input;
    const attachedImage = selectedImage;

    // Build the user message with optional image preview
    let imageDataUrl: string | undefined;
    if (attachedImage) {
      imageDataUrl = await fileToDataUrl(attachedImage);
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage, image: imageDataUrl },
    ]);
    setInput("");
    setSelectedImage(null);
    setIsTyping(true);

    try {
      // If there's an image, get CNN prediction and append to prompt
      let promptText = userMessage;

      if (attachedImage) {
        try {
          const cnnResult = await ModelsNBService.cnn(attachedImage);
          promptText += `\n\n[PREDICCIÓN MODELO CNN]: ${JSON.stringify(cnnResult.ans)}`;
        } catch (cnnError) {
          console.error("Error en predicción CNN:", cnnError);
        }
      }

      const response = await sessionRef.current.prompt(promptText);
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
    selectedImage,
    setSelectedImage,
    imagePreview,
    removeImage,
    status,
    isTyping,
    handleSubmit,
  };
}
