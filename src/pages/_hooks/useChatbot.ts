import { useState, useEffect, useRef } from "react";
import type { Message, MlpRequest } from "../_types/types";
import { PRE_PROMPTS } from "../_constants/pre-prompts";
import {
  MLP_DEFAULTS,
  MLP_FIELD_LABELS,
  MLP_EXTRACTION_PROMPT,
} from "../_constants/mlp-defaults";
import { MLP_INTENT_DETECTION_PROMPT } from "../_constants/mlp-intent";
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
  const [input, setInput] = useState(
    "Alquilo hermoso apartamento de diseño sustentable, ideal para 4 personas. El espacio entero cuenta con 2 habitaciones, 3 camas reales de alta calidad y 1.5 baños con grifería de bajo consumo. El precio por noche es de 120 dólares con política de cancelación flexible. Llevo 3 años como host, con identidad verificada y foto de perfil (aún no soy superhost). Ofrecemos 12 amenidades en total para tu cuidado personal y confort. No usamos reserva instantánea ni exigimos verificar el teléfono del huésped. Mostramos la ubicación exacta. Tenemos disponibilidad mayor a 90 días. Hasta ahora mantenemos un excelente orden y limpieza, lo que nos ha dado 25 reseñas con un promedio de calificación de 4.8.",
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"checking" | "ready" | "unavailable">(
    "checking",
  );
  const [isTyping, setIsTyping] = useState(false);
  const sessionRef = useRef<any>(null);
  const thinkingSessionRef = useRef<any>(null);

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

          thinkingSessionRef.current = await window.LanguageModel.create({
            expectedOutputs: [{ type: "text", languages: ["es"] }],
            initialPrompts: [
              {
                role: "system",
                content:
                  "Eres un extractor de datos y clasificador de intenciones. Responde SIEMPRE de forma concisa y en el formato exacto que se te pida.",
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
      if (sessionRef.current) sessionRef.current.destroy();
      if (thinkingSessionRef.current) thinkingSessionRef.current.destroy();
    };
  }, []);

  const removeImage = () => {
    setSelectedImage(null);
  };

  /**
   * Adds a "thinking" message and returns a function to update/remove it.
   */
  const addThinkingMessage = (text: string) => {
    const thinkingMsg: Message = {
      role: "assistant",
      text: "",
      thinking: text,
    };

    setMessages((prev) => [...prev, thinkingMsg]);

    return {
      update: (newText: string) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.thinking) {
            updated[lastIdx] = {
              ...updated[lastIdx],
              thinking: newText,
            };
          }
          return updated;
        });
      },
      remove: () => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.thinking) {
            updated.pop();
          }
          return updated;
        });
      },
    };
  };

  /**
   * Detects if the user wants to evaluate a property (MLP intent).
   */
  const detectMlpIntent = async (userMessage: string): Promise<boolean> => {
    if (!thinkingSessionRef.current) return false;
    try {
      const response = await thinkingSessionRef.current.prompt(
        MLP_INTENT_DETECTION_PROMPT + userMessage,
      );
      return response.trim().toUpperCase().startsWith("SI");
    } catch (error) {
      console.error("Error detectando intención MLP:", error);
      return false;
    }
  };

  /**
   * Extracts MLP parameters from the user's message using the LanguageModel.
   * Returns the extracted params and which fields were detected vs assumed.
   */
  const extractMlpParams = async (
    userMessage: string,
  ): Promise<{
    params: MlpRequest;
    detected: string[];
    assumed: string[];
  }> => {
    const allFields = Object.keys(MLP_DEFAULTS) as (keyof MlpRequest)[];
    let extractedFields: Partial<MlpRequest> = {};

    if (thinkingSessionRef.current) {
      try {
        const response = await thinkingSessionRef.current.prompt(
          MLP_EXTRACTION_PROMPT + userMessage,
        );

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          extractedFields = JSON.parse(jsonMatch[0]);
        }
      } catch (error) {
        console.error("Error extrayendo parámetros MLP:", error);
      }
    }

    const detected: string[] = [];
    const assumed: string[] = [];

    const finalParams: MlpRequest = { ...MLP_DEFAULTS };

    for (const field of allFields) {
      const label = MLP_FIELD_LABELS[field] || String(field);
      if (field in extractedFields && extractedFields[field] !== undefined) {
        (finalParams as any)[field] = extractedFields[field];
        detected.push(label);
      } else {
        assumed.push(`${label}: ${MLP_DEFAULTS[field]}`);
      }
    }

    return { params: finalParams, detected, assumed };
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready" || !sessionRef.current) return;

    const userMessage = input;
    const attachedImage = selectedImage;

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
      let promptText = userMessage;

      // CNN flow (existing)
      if (attachedImage) {
        try {
          const cnnResult = await ModelsNBService.cnn(attachedImage);
          promptText += `\n\n[PREDICCIÓN MODELO CNN]: ${JSON.stringify(cnnResult.ans)}`;
        } catch (cnnError) {
          console.error("Error en predicción CNN:", cnnError);
        }
      }

      // MLP flow (new) — thinking state
      const thinking = addThinkingMessage(
        "Analizando intención del mensaje...",
      );

      const wantsMlp = await detectMlpIntent(userMessage);

      if (wantsMlp) {
        thinking.update("Extrayendo parámetros del inmueble...");

        const { params, detected, assumed } =
          await extractMlpParams(userMessage);

        thinking.update("Consultando modelo MLP...");

        try {
          const mlpResult = await ModelsNBService.mlp(params);

          // Build the prediction block for the agent
          let mlpBlock = `\n\n[PREDICCIÓN MODELO MLP]:`;
          mlpBlock += `\n- Superhost: predicción=${mlpResult.ans.superhost.prediccion}, confianza=${mlpResult.ans.superhost.score}`;
          mlpBlock += `\n- Instant Bookable: predicción=${mlpResult.ans.instant.prediccion}, confianza=${mlpResult.ans.instant.score}`;
          mlpBlock += `\n- Disponibilidad >90 días: predicción=${mlpResult.ans.disp90.prediccion}, confianza=${mlpResult.ans.disp90.score}`;
          mlpBlock += `\n- Rango de precio: predicción=${mlpResult.ans.precio.prediccion}, confianza=${mlpResult.ans.precio.score}`;
          mlpBlock += `\n- Calificación estimada: predicción=${mlpResult.ans.calificacion.prediccion}`;

          // Report detected vs assumed values
          if (detected.length > 0) {
            mlpBlock += `\n\n[PARÁMETROS DETECTADOS DEL MENSAJE]: ${detected.join(", ")}`;
          }
          if (assumed.length > 0) {
            mlpBlock += `\n\n[PARÁMETROS ASUMIDOS (valores optimistas por defecto)]:\n${assumed.map((a) => `- ${a}`).join("\n")}`;
          }

          promptText += mlpBlock;
        } catch (mlpError) {
          console.error("Error en predicción MLP:", mlpError);
          promptText += `\n\n[PREDICCIÓN MODELO MLP]: Error al consultar el modelo`;
        }
      }

      thinking.remove();

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
