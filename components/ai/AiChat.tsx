"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
// import toast from "@/components/ui/sonner"
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles,
  Bot,
  User,
  Settings,
  X,
  CornerRightUp,
  MessageCircle,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../CartContext";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Components } from "react-markdown";
import { toast } from "sonner";
import { AnimatedAirasearch } from "../AnimatedAirasearch";

interface Message {
  id: number;
  sender: "user" | "ai";
  text?: string;
  products?: Product[];
  timestamp: string;
}

interface Product {
  id: string;
  name: string;
  company: string;
  description: string;
  image: string;
  price: number;
}
export function convertImageUrlsToMarkdown(text: string): string {
  const imageRegex =
    /(?:^|\s)(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp)(\?[^\s]*)?)/gi;

  return text.replace(imageRegex, (match, url) => {
    const trimmedUrl = url.trim();
    return `![Image](${trimmedUrl})`; // removed leading space
  });
}

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
// const BACKEND_BASE="http://localhost:5500"
export default function AiChat() {
  const { user } = useUser();
  const userId = user?.id;
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const u = useUser();
  const isLogged = u.isSignedIn;

  const { addToCart, setUpdate } = useCart();
  useEffect(() => {
    if (!userId) return;

    // Prevent body scroll when chat is expanded
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [expanded]);

  useEffect(() => {
    if (!userId) return;
    const fetchHistory = async () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      try {
        const res = await fetch(`${BACKEND_BASE}/getUserHistory/${userId}`);
        const data = await res.json();
        const formatted = data.map((msg: any, index: number) => ({
          id: Date.now() + index,
          sender: msg.role === "user" ? "user" : "ai",
          text: msg.parts?.[0]?.text || "",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, [userId]);
  const clearChat = async () => {
    try {
      const clr = await fetch(`${BACKEND_BASE}/deleteChat/${userId}`);
      if (clr.ok) {
        toast.success("chat cleared ");
        setMessages([]);
        console.log("ok");
      }
    } catch (error: any) {
      console.error("failed to delete chats");
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !userId) return;

    const ts = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      timestamp: ts,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputValue, userId }),
      });

      const data = await res.json();
      const replyMessage: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.finalReply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      console.log(data.finalReply);

      if (data.finalReply.includes("updated")) {
        setUpdate(true);
      }
      setMessages((prev) => [...prev, replyMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "ai",
          text: "⚠️ Server error while responding.",
          timestamp: ts,
        },
      ]);
    }

    setIsTyping(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const MarkdownComponents: Components = {
    img: ({ src = "", alt = "" }) => {
      if (!src) return null;

      return (
        <div className="my-4">
          <Image
            src={src}
            alt={alt}
            width={600}
            height={400}
            className="rounded-lg shadow-md w-auto h-auto max-w-full"
          />
        </div>
      );
    },
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {children}
      </a>
    ),
  };

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            <div
              className="absolute inset-0 "
              onClick={() => setExpanded(false)}
            />
            <Card className="absolute right-0 top-0 h-full w-full sm:max-w-lg bg-white dark:bg-zinc-900 shadow-2xl border-0 flex flex-col overflow-hidden">
              {/* Header */}
              <CardHeader
                className="flex w-full justify-between items-center
              border-b border-zinc-200 dark:border-zinc-800 p-6 bg-white
              dark:bg-zinc-900"
              >
                {" "}
                <div
                  className="flex items-center
              space-x-3"
                >
                  {" "}
                  <div
                    className="flex items-center justify-center
              w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full"
                  >
                    <Sparkles
                      className="h-5 w-5 text-indigo-600
              dark:text-neutral-200"
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <CardTitle
                      className="text-lg font-semibold text-zinc-900
              dark:text-zinc-100"
                    >
                      {" "}
                      AI Assistant{" "}
                    </CardTitle>{" "}
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {" "}
                      Always here to help{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div
                  className="flex
              items-center space-x-1"
                >
                  <Button
                    onClick={clearChat}
                    variant={"destructive"}
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpanded(false)}
                    className="h-9 w-9 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                  {messages.length === 0 ? (
                    !isLogged ? (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
                        Sign in to start a conversation
                        <div className="flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4 cursor-pointer">
                          <SignInButton>Sign in</SignInButton>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center justify-center w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                          <MessageCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          Start a conversation
                        </h3>
                        <p className="text-sm text-center max-w-xs">
                          Ask me anything about products, get recommendations,
                          or just chat!
                        </p>
                      </div>
                    )
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-1 w-full ${
                          msg.sender === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <Avatar className="h-8 w-8 shrink-0 mt-1">
                          <AvatarFallback
                            className={`text-xs font-medium ${
                              msg.sender === "user"
                                ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {msg.sender === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>

                        {/* Message Content */}
                        <div
                          className={`flex flex-col min-w-0 flex-1 max-w-[calc(100%-3.5rem)] ${
                            msg.sender === "user" ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`relative px-4 py-3 rounded-2xl break-words ${
                              msg.sender === "user"
                                ? "bg-indigo-600 text-white max-w-[85%]"
                                : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 max-w-[90%]"
                            }`}
                          >
                            {msg.text && (
                              <div className="prose dark:prose-invert max-w-full p-2  [&>*]:my-2">
                                <ReactMarkdown
                                  components={MarkdownComponents}
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeRaw]}
                                >
                                  {convertImageUrlsToMarkdown(msg.text || "")}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                          {/* Timestamp */}
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 px-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-3 w-full">
                      <Avatar className="h-8 w-8 shrink-0 mt-1">
                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="h-2 w-2 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                      <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder=""
                        className="resize-none min-h-[44px] max-h-32 pr-12 text-sm border-zinc-200 dark:border-zinc-700 focus-visible:ring-0 p-4 bg-white dark:bg-zinc-800 "
                        disabled={isTyping}
                        rows={1}
                      />
                      <Button
                        onClick={sendMessage}
                        size="sm"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 bottom-2 h-8 w-8 p-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
                      >
                        <CornerRightUp className="h-4 w-4 text-neutral-100" />
                      </Button>
                      {inputValue == "" && (
                        <div className="absolute top-4 left-3">
                          <AnimatedAirasearch />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            onClick={() => setExpanded(true)}
            variant={"outline"}
            className="fixed bottom-8 right-8  text-foreground rounded-full w-14 h-14 shadow-xl border-0 transition-all duration-200 hover:scale-105 z-50 "
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </>
  );
}
