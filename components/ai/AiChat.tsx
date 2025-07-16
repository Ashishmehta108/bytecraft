// components/AiChat.tsx
"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Bot, User, Settings, X, CornerRightUp } from "lucide-react";
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

const STORAGE_KEY = "ai-chat-messages";

export default function AiChat() {
  const sessionId = useRef<string>(crypto.randomUUID());
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  // Load persisted messages
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Persist and scroll
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const ts = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: inputValue, timestamp: ts },
    ]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          message: inputValue,
        }),
      });
      const data = await res.json();
      const replyTs = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (data.fromTool && Array.isArray(data.data)) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: "Here are some products you might like:",
            timestamp: replyTs,
          },
          {
            id: Date.now() + 2,
            sender: "ai",
            products: data.data,
            timestamp: replyTs,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: data.response,
            timestamp: replyTs,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: "⚠️ Failed to get response.",
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

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setExpanded(false)}
            />
            <Card className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-neutral-950 shadow-2xl flex flex-col">
              <CardHeader className="flex justify-between items-center border-b dark:border-neutral-700 p-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl font-semibold">
                    AI Assistant
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpanded(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Sparkles className="h-6 w-6" />
                      <p className="mt-2 text-sm">Start a conversation...</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-end"
                        style={{
                          justifyContent:
                            msg.sender === "user" ? "flex-end" : "flex-start",
                        }}
                      >
                        {msg.sender === "ai" && (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>
                              <Sparkles className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`relative max-w-[75%] p-3 rounded-xl ${
                            msg.sender === "user"
                              ? "bg-indigo-500 text-white"
                              : "bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
                          }`}
                        >
                          {msg.text && (
                            <p className="text-sm whitespace-pre-wrap">
                              {msg.text}
                            </p>
                          )}
                          {msg.products && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                              {msg.products.map((p) => (
                                <div
                                  key={p.id}
                                  className="bg-white dark:bg-neutral-900 rounded-xl shadow p-3"
                                >
                                  <Image
                                    src={p.image}
                                    alt={p.name}
                                    width={120}
                                    height={80}
                                    className="object-contain rounded"
                                  />
                                  <h3 className="mt-2 font-semibold text-sm">
                                    {p.name}
                                  </h3>
                                  <p className="text-xs text-neutral-500">
                                    ₹{p.price}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="mt-2"
                                    onClick={() =>
                                      addToCart({
                                        ...p,
                                        quantity: 1,
                                        areaOfUse: "",
                                        type: "",
                                      })
                                    }
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-xs mt-1 opacity-60 text-right">
                            {msg.timestamp}
                          </p>
                        </div>
                        {msg.sender === "user" && (
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))
                  )}
                  {isTyping && (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <Separator />
                <div className="p-4 bg-white dark:bg-neutral-950 flex items-center space-x-2">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 resize-none h-10 max-h-24"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <CornerRightUp className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <Button
          onClick={() => setExpanded(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-xl"
        >
          <Sparkles className="h-5 w-5" />
        </Button>
      )}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Customize your assistant.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button variant="outline">Change Persona</Button>
            <Button variant="outline">Enable Voice</Button>
          </div>
          <DialogClose className="absolute top-2 right-2 cursor-pointer" />
        </DialogContent>
      </Dialog>
    </>
  );
}
