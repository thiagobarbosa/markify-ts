"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { MarkdownResponse } from "../types/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { ThemeToggle } from "./theme-toggle";
import { Copy, Download, Check, ExternalLink } from "lucide-react";

interface MarkdownDisplayProps {
  result: MarkdownResponse;
}

export function MarkdownDisplay({ result }: MarkdownDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result.markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([result.markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title || "markdown"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border border-border overflow-hidden mb-8">
      <CardHeader className="bg-muted/50 flex flex-row items-center justify-between p-4 border-b">
        <CardTitle className="text-lg font-medium flex items-center">
          {result.title || "Converted Markdown"}
          <a
            href={result.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-muted-foreground hover:text-primary inline-flex items-center"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Visit original page</span>
          </a>
        </CardTitle>
        <ThemeToggle />
      </CardHeader>
      
      <CardContent className="p-0">
        <motion.div 
          className="overflow-auto max-h-[500px] p-4 bg-muted/30 font-mono text-sm whitespace-pre-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {result.markdown}
        </motion.div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 p-4 bg-background border-t">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-1"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="default"
            size="sm"
            onClick={downloadMarkdown}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
}