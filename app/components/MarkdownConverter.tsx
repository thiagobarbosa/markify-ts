"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMarkdownFromUrl } from "../lib/api";
import { MarkdownDisplay } from "./MarkdownDisplay";
import { UrlInput } from "./UrlInput";
import { MarkdownResponse } from "../types/api";
import { Card, CardContent } from "./ui/card";

export default function MarkdownConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MarkdownResponse | null>(null);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getMarkdownFromUrl(url);
      
      if (response.error) {
        setError(response.error);
        setResult(null);
      } else {
        setResult(response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <Card className="mb-8 overflow-hidden border border-border">
        <CardContent className="p-6">
          <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8 p-4 bg-destructive/10 text-destructive rounded-md"
          >
            {error}
          </motion.div>
        )}

        {result && !error && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MarkdownDisplay result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}