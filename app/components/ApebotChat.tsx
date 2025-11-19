"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare, Minimize2, Maximize2 } from "lucide-react";
import { sendToApebot, type ChatMessage, acpConfig } from "../config/acp.config";

interface ApebotChatProps {
  initialOpen?: boolean;
}

export default function ApebotChat({ initialOpen = false }: ApebotChatProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Welcome to ${acpConfig.shopName}! I'm your AI shopping assistant. How can I help you today?`,
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substring(7)}`);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendToApebot({
        message: userMessage.content,
        context: messages,
        sessionId: sessionId.current,
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If there are product suggestions, add them as a separate message
      if (response.products && response.products.length > 0) {
        const productsMessage: ChatMessage = {
          role: "assistant",
          content: `Here are some products you might like:\n\n${response.products
            .map((p) => `• ${p.name} - $${p.price}`)
            .join("\n")}`,
          timestamp: Date.now() + 1,
        };
        setMessages((prev) => [...prev, productsMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again or visit A-OK.shop directly.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#8b0000] hover:bg-[#a00000] text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Open chat with Apebot"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? "bottom-6 right-6 w-80"
          : "bottom-6 right-6 w-96 h-[600px] max-h-[80vh]"
      }`}
    >
      {/* Chat Window */}
      <div className="bg-[#f5f5dc] border-2 border-[#8b0000] rounded-lg shadow-2xl flex flex-col h-full font-mono">
        {/* Header */}
        <div className="bg-[#8b0000] text-white p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} />
            <span className="font-bold">A-OK Apebot</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-[#a00000] p-1 rounded transition-colors"
              aria-label={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-[#a00000] p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafaf0]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-[#8b0000] text-white"
                        : "bg-[#e8e8d8] text-[#333333] border border-[#cccccc]"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.role === "user" ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#e8e8d8] text-[#333333] border border-[#cccccc] rounded-lg p-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t-2 border-[#cccccc] p-3 bg-[#f5f5dc]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about products..."
                  className="flex-1 bg-white border border-[#cccccc] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8b0000] font-mono text-[#333333]"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[#8b0000] hover:bg-[#a00000] text-white p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="mt-2 text-xs text-[#666666] text-center">
                Powered by{" "}
                <a
                  href={acpConfig.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0000ff] hover:underline"
                >
                  A-OK.shop
                </a>
              </div>
            </div>
          </>
        )}

        {isMinimized && (
          <div className="p-3 text-center text-sm text-[#666666]">
            Click to expand chat
          </div>
        )}
      </div>
    </div>
  );
}
