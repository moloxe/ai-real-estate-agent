import { useRef } from "react";
import { useChatbot } from "../_hooks/useChatbot";
import { ChatHistory } from "./ChatHistory";
import SendIcon from "./SendIcon";
import ImageIcon from "./ImageIcon";

export default function LocalChatbot() {
  const {
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
  } = useChatbot();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
    // Reset so re-selecting the same file triggers onChange
    e.target.value = "";
  };

  return (
    <div className="box-border flex h-full w-full flex-col rounded-lg border border-gray-300 bg-white p-4 font-sans shadow-sm">
      <ChatHistory messages={messages} status={status} isTyping={isTyping} />

      {imagePreview && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Vista previa"
              className="h-16 w-16 rounded-md border border-gray-300 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-red-500 text-xs leading-none text-white shadow-sm transition-colors hover:bg-red-600"
              title="Quitar imagen"
            >
              ✕
            </button>
          </div>
          <span className="text-xs text-gray-500">{selectedImage?.name}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleImageClick}
          disabled={status !== "ready" || isTyping}
          className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-3 text-gray-600 transition-colors duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
          title="Adjuntar imagen"
        >
          <ImageIcon />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e: any) => setInput(e.target.value)}
          disabled={status !== "ready" || isTyping}
          className="flex-1 rounded-md border border-gray-300 p-3 text-base transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:bg-gray-50"
          placeholder={
            selectedImage
              ? "Escribe un mensaje sobre la imagen..."
              : "Escribe un mensaje..."
          }
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
