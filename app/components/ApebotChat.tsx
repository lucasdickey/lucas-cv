"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, MessageSquare, Minimize2, Maximize2, ShoppingCart } from "lucide-react";
import { sendToApebot, type ChatMessage, acpConfig } from "../config/acp.config";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  url: string;
}

interface ApebotChatProps {
  initialOpen?: boolean;
}

const CHAT_STORAGE_KEY = 'apebot-chat-history';
const CHAT_OPEN_STORAGE_KEY = 'apebot-chat-open';

// Initialize messages - try to load from localStorage first, fallback to welcome message
const initializeMessages = (): ChatMessage[] => {
  if (typeof window === 'undefined') {
    return [{
      role: "assistant",
      content: `Welcome to ${acpConfig.shopName}! I'm your AI shopping assistant. How can I help you today?`,
      timestamp: Date.now(),
    }];
  }

  try {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('[Chat] Initializing with', parsed.length, 'saved messages from localStorage');
        return parsed;
      }
    }
  } catch (error) {
    console.error('[Chat] Error loading messages during init:', error);
  }

  // Fallback to welcome message
  return [{
    role: "assistant",
    content: `Welcome to ${acpConfig.shopName}! I'm your AI shopping assistant. How can I help you today?`,
    timestamp: Date.now(),
  }];
};

export default function ApebotChat({ initialOpen = false }: ApebotChatProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initializeMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingOutProductId, setCheckingOutProductId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substring(7)}`);

  // Restore open state from localStorage on mount
  useEffect(() => {
    try {
      const savedOpenState = localStorage.getItem(CHAT_OPEN_STORAGE_KEY);
      if (savedOpenState === 'true') {
        setIsOpen(true);
        console.log('[Chat] Chat was open, restoring open state');
      }
    } catch (error) {
      console.error('[Chat] Failed to load open state:', error);
    }
  }, []);

  const handleCheckout = async (product: Product) => {
    setCheckingOutProductId(product.id);
    try {
      console.log(`[Chat] Starting checkout for product:`, product);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });

      console.log(`[Chat] Checkout response status:`, response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Chat] Checkout error:`, errorText);
        throw new Error("Checkout failed");
      }

      const { checkoutUrl, sessionId: stripeSessionId } = await response.json();

      // Log the checkout attempt
      const checkoutMessage: ChatMessage = {
        role: "assistant",
        content: `🛒 Great choice! Redirecting to checkout for "${product.name}"...`,
        timestamp: Date.now(),
      };
      const newMessages = [...messages, checkoutMessage];

      // Save to localStorage immediately before redirecting
      console.log('[Chat] Saving', newMessages.length, 'messages to localStorage before checkout');
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
      console.log('[Chat] Saved. Verified:', localStorage.getItem(CHAT_STORAGE_KEY) ? 'SUCCESS' : 'FAILED');
      setMessages(newMessages);

      // Redirect to Stripe checkout after brief delay to ensure state updates
      setTimeout(() => {
        if (checkoutUrl) {
          console.log('[Chat] Redirecting to Stripe checkout');
          window.location.href = checkoutUrl;
        }
      }, 100);
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, there was an issue starting checkout. Please visit A-OK.shop directly to complete your purchase.",
        timestamp: Date.now(),
      };
      const newMessages = [...messages, errorMessage];
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
      setMessages(newMessages);
    } finally {
      setCheckingOutProductId(null);
    }
  };

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Save chat open state to localStorage
  useEffect(() => {
    localStorage.setItem(CHAT_OPEN_STORAGE_KEY, isOpen.toString());
  }, [isOpen]);

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

      // Store products in a special message format for later rendering
      if (response.products && response.products.length > 0) {
        const productsMessage: ChatMessage & { products?: Product[] } = {
          role: "assistant",
          content: "Here are some products you might like:",
          timestamp: Date.now() + 1,
          products: response.products,
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
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#8b0000] hover:bg-[#a00000] text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 font-semibold text-xs sm:text-sm"
        aria-label="Open chat with Apebot"
      >
        <MessageSquare size={16} />
        <span className="hidden sm:inline">Shop the A-OK Bot</span>
        <span className="sm:hidden">Chat</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isMinimized
          ? "bottom-4 right-4 sm:bottom-6 sm:right-6 w-64 sm:w-80"
          : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[576px] h-[calc(100vh-32px)] sm:h-[900px] max-h-[80vh]"
      }`}
    >
      {/* Chat Window */}
      <div className="bg-[#f5f5dc] border-2 border-[#8b0000] rounded-lg shadow-2xl flex flex-col h-full font-mono">
        {/* Header */}
        <div className="bg-[#8b0000] text-white p-2 sm:p-3 rounded-t-lg flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <MessageSquare size={18} className="flex-shrink-0" />
            <span className="font-bold text-sm sm:text-base truncate">A-OK Apebot</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-[#a00000] p-1 rounded transition-colors"
              aria-label={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-[#a00000] p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3 bg-[#fafaf0]">
              {messages.map((msg: any, idx) => (
                <div key={idx}>
                  <div
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] rounded-lg p-2 sm:p-3 ${
                        msg.role === "user"
                          ? "bg-[#8b0000] text-white"
                          : "bg-[#e8e8d8] text-[#333333] border border-[#cccccc]"
                      }`}
                    >
                      <div className="text-xs sm:text-sm whitespace-pre-wrap break-words">
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

                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex justify-start mt-2 sm:mt-3">
                      <div className="max-w-[90%] sm:max-w-[85%] space-y-2">
                        {msg.products.map((product: Product) => (
                          <div
                            key={product.id}
                            className="bg-white border border-[#cccccc] rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex gap-2 sm:gap-3">
                              {/* Product Image */}
                              <div className="flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded border border-[#cccccc]"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>

                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[#333333] text-xs sm:text-sm mb-1 line-clamp-2">
                                  {product.name}
                                </h4>
                                <p className="text-[#8b0000] font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
                                  ${product.price.toFixed(2)}
                                </p>
                                <button
                                  onClick={() => handleCheckout(product)}
                                  disabled={checkingOutProductId === product.id}
                                  className={`inline-flex items-center gap-1 bg-[#8b0000] hover:bg-[#a00000] text-white text-xs font-bold py-1 px-2 sm:px-3 rounded transition-colors ${
                                    checkingOutProductId === product.id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#a00000]'
                                  }`}
                                >
                                  <ShoppingCart size={12} className="hidden sm:inline" />
                                  {checkingOutProductId === product.id ? 'Processing...' : 'Buy'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
            <div className="border-t-2 border-[#cccccc] p-2 sm:p-3 bg-[#f5f5dc]">
              <div className="flex gap-1 sm:gap-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about products..."
                  className="flex-1 bg-white border border-[#cccccc] rounded px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-[#8b0000] font-mono text-[#333333] resize-none h-16 sm:h-20 overflow-y-auto"
                  disabled={isLoading}
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-[#8b0000] hover:bg-[#a00000] text-white p-1.5 sm:p-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} className="sm:block" />
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
