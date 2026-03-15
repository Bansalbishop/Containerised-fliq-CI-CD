import React, { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Loader, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";
const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessages, isSending } = useChatStore();
  const inputRef = useRef(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Select only image file");
      return;
    }

    const reader = new FileReader(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value == "";
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value == "";
    } catch (error) {
      toast.error("Failed to send message", error);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="preview"
              className={`w-20 h-20 object-cover ${isSending ? "opacity-30" : ""} rounded-lg border border-zinc-700`}
            />
            {isSending && (
              <Loader2
                size={40}
                className="animate-spin absolute inset-0 m-auto "
              />
            )}
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          ref={inputRef}
          className="w-full input input-bordered rounded-lg input-sm sm:input-md"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="file"
          className="hidden"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <button
          type={imagePreview ? "submit" : "button"}
          tabIndex={imagePreview ? -1 : 0}
          onMouseDown={(e) => e.preventDefault()}
          className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
          onClick={() => {
            fileInputRef.current?.click();
            inputRef.current?.focus();
          }}
        >
          <Image size={20} />
        </button>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={isSending || (!text.trim() && !imagePreview)}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
