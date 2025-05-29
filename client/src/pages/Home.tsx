import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeEditor from "@/components/CodeEditor";
import ResultsSection from "@/components/ResultsSection";
import InformationSection from "@/components/InformationSection";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, Clock, Settings, FolderSync } from "lucide-react";
import { LANGUAGES } from "@/lib/languages";
import { UserSession } from "@/lib/userSession";

interface AnalysisResult {
  id: number;
  similarityPercentage: number;
  structuralSimilarity: number;
  controlFlow: number;
  logicPatterns: number;
  variableRenaming: boolean;
  tokensAnalyzed: number;
  matchingSegments: number;
  matches: Array<{
    id: number;
    code1Lines: string;
    code2Lines: string;
    code1Content: string;
    code2Content: string;
    variableChanges: string[];
  }>;
  analysisTime: string;
}

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (data: {
      language: string;
      code1: string;
      code2: string;
      userId: string;
    }) => {
      const response = await apiRequest(
        "POST",
        "/api/plagiarism/analyze",
        data,
      );
      return response.json();
    },
    onSuccess: (result: AnalysisResult) => {
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: `Plagiarism analysis completed in ${result.analysisTime}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze code for plagiarism",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = useCallback(() => {
    if (!code1.trim()) {
      toast({
        title: "Missing Code",
        description: "Please enter code in the first editor",
        variant: "destructive",
      });
      return;
    }
    if (!code2.trim()) {
      toast({
        title: "Missing Code",
        description: "Please enter code in the second editor",
        variant: "destructive",
      });
      return;
    }
    analyzeMutation.mutate({
      language: selectedLanguage,
      code1,
      code2,
      userId: UserSession.getUserId(),
    });
  }, [code1, code2, selectedLanguage, analyzeMutation, toast]);

  const handleLanguageSelect = useCallback((language: string) => {
    setSelectedLanguage(language);
  }, []);

  const handleClear = useCallback((editorNumber: 1 | 2) => {
    if (editorNumber === 1) setCode1("");
    else setCode2("");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language Selector */}
        <div className="mb-8">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 sm:mb-0">
                  Programming Language
                </h2>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <FolderSync className="w-4 h-4" />
                  <span>Auto-sync enabled</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLanguageSelect(lang.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                      selectedLanguage === lang.id
                        ? "border-primary bg-blue-50 text-primary"
                        : "border-slate-200 bg-white hover:border-primary hover:bg-blue-50"
                    }`}
                  >
                    <lang.icon className={`text-lg mb-1 ${lang.color}`} />
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editors */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <CodeEditor
            title="Code Sample 1"
            value={code1}
            onChange={setCode1}
            language={selectedLanguage}
            onClear={() => handleClear(1)}
            placeholder="Paste your first code sample here..."
          />
          <CodeEditor
            title="Code Sample 2"
            value={code2}
            onChange={setCode2}
            language={selectedLanguage}
            onClear={() => handleClear(2)}
            placeholder="Paste your second code sample here..."
          />
        </div>

        {/* Analysis Controls */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzeMutation.isPending}
                  className="bg-primary hover:bg-blue-700 font-medium px-6 py-3"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      <span>Check Plagiarism</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Analysis time: ~2-3 seconds</span>
                </div>
              </div>

              
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysisResult && (
          <ResultsSection
            result={analysisResult}
            selectedLanguage={selectedLanguage}
          />
        )}

        {/* Information Section */}
        <InformationSection />
      </main>

      <Footer />
    </div>
  );
}
