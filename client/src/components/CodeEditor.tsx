import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  language: string;
  onClear: () => void;
  placeholder: string;
}

export default function CodeEditor({ title, value, onChange, language, onClear, placeholder }: CodeEditorProps) {
  const [lineCount, setLineCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const lines = value ? value.split("\n").length : 0;
    setLineCount(lines);
    setCharCount(value.length);
  }, [value]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "Copied", description: "Code copied to clipboard" });
    } catch {
      toast({ title: "Copy Failed", description: "Failed to copy code to clipboard", variant: "destructive" });
    }
  };

  const handleClear = () => {
    onClear();
    toast({ title: "Cleared", description: "Code editor cleared" });
  };

  return (
    <Card className="shadow-sm border-border dark:border-muted overflow-hidden">
      <div className="bg-muted dark:bg-card px-4 py-3 border-b border-border dark:border-muted">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">{title}</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-0">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-80 p-4 font-mono text-sm bg-slate-900 text-slate-100 border-0 resize-none focus:outline-none focus:ring-0 rounded-none"
        />
      </CardContent>
      <div className="bg-muted dark:bg-card px-4 py-2 border-t border-border dark:border-muted">
        <span className="text-xs text-muted-foreground">
          Lines: {lineCount} | Characters: {charCount}
        </span>
      </div>
    </Card>
  );
}