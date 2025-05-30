import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getQueryFn } from "@/lib/queryClient";
import { Clock, Code, Eye, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { UserSession } from "@/lib/userSession";
import { formatInTimeZone } from 'date-fns-tz'
import { useQueryClient } from '@tanstack/react-query';

// you can still keep your `format` import if you need it elsewhere


interface AnalysisHistory {
  id: number;
  language: string;
  code1: string;
  code2: string;
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
  createdAt: string;
}

export default function History() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisHistory | null>(null);

  const userId = UserSession.getUserId();
    // const userId = UserSession.getUserId();
  const qc = useQueryClient();
  
  const { data: analyses, isLoading } = useQuery({
    queryKey: [`/api/plagiarism/recent?userId=${userId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!userId,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const getSimilarityColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-100 text-red-800 border-red-200";
    if (percentage >= 60) return "bg-orange-100 text-orange-800 border-orange-200";
    if (percentage >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getSimilarityLabel = (percentage: number) => {
    if (percentage >= 80) return "High Similarity";
    if (percentage >= 60) return "Moderate Similarity";
    if (percentage >= 40) return "Low Similarity";
    return "Minimal Similarity";
  };

  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedAnalysis(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">Analysis Details</h1>
            <p className="text-slate-600">
              Analysis #{selectedAnalysis.id} •{' '}
              {formatInTimeZone(
                selectedAnalysis.createdAt,
                'Asia/Kolkata',
                'PPpp'
              )}
            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <div className="bg-slate-100 px-4 py-3 border-b">
                <h3 className="font-medium text-slate-900">Code Sample 1</h3>
              </div>
              <CardContent className="p-0">
                <pre className="bg-slate-900 text-slate-100 p-4 text-sm font-mono overflow-x-auto h-80">
                  <code>{selectedAnalysis.code1}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <div className="bg-slate-100 px-4 py-3 border-b">
                <h3 className="font-medium text-slate-900">Code Sample 2</h3>
              </div>
              <CardContent className="p-0">
                <pre className="bg-slate-900 text-slate-100 p-4 text-sm font-mono overflow-x-auto h-80">
                  <code>{selectedAnalysis.code2}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Analysis Results</h2>
                <Badge className={getSimilarityColor(selectedAnalysis.similarityPercentage)}>
                  {selectedAnalysis.similarityPercentage}% Similarity
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Detection Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Structural Similarity:</span>
                      <span className="font-medium text-slate-900">{selectedAnalysis.structuralSimilarity}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Variable Renaming:</span>
                      <span className={`font-medium ${selectedAnalysis.variableRenaming ? 'text-accent' : 'text-slate-900'}`}>
                        {selectedAnalysis.variableRenaming ? 'Detected' : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Control Flow:</span>
                      <span className="font-medium text-slate-900">{selectedAnalysis.controlFlow}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Logic Patterns:</span>
                      <span className="font-medium text-slate-900">{selectedAnalysis.logicPatterns}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Analysis Metadata</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Language:</span>
                      <span className="font-medium text-slate-900 capitalize">{selectedAnalysis.language}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Tokens Analyzed:</span>
                      <span className="font-medium text-slate-900">{selectedAnalysis.tokensAnalyzed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Matching Segments:</span>
                      <span className="font-medium text-slate-900">{selectedAnalysis.matchingSegments}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAnalysis.matches.length > 0 && (
                <div className="border-t border-slate-200 pt-6 mt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Matching Code Segments</h4>
                  {selectedAnalysis.matches.map((match) => (
                    <div key={match.id} className="bg-slate-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-700">Match #{match.id}</span>
                        <span className="text-sm text-slate-500">
                          Lines {match.code1Lines} vs {match.code2Lines}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-2">Sample 1:</div>
                          <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono overflow-x-auto">
                            <code>{match.code1Content}</code>
                          </pre>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-2">Sample 2:</div>
                          <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono overflow-x-auto">
                            <code>{match.code2Content}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analysis History</h1>
              <p className="text-slate-600">Review your past plagiarism detection results</p>
            </div>
            <Link href="/">
              <Button>
                <Code className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-500">Loading analysis history...</div>
          </div>
        ) : !analyses || (Array.isArray(analyses) && analyses.length === 0) ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Analysis History</h3>
              <p className="text-slate-600 mb-4">You haven't performed any plagiarism analyses yet.</p>
              <Link href="/">
                <Button>
                  <Code className="w-4 h-4 mr-2" />
                  Start Your First Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Array.isArray(analyses) && analyses.map((analysis: AnalysisHistory) => (
              <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-semibold text-slate-900">
                          Analysis #{analysis.id}
                        </h3>
                        <Badge variant="outline" className="capitalize">
                          {analysis.language}
                        </Badge>
                        <Badge className={getSimilarityColor(analysis.similarityPercentage)}>
                          {analysis.similarityPercentage}% Similarity
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-slate-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatInTimeZone(
                              analysis.createdAt,        // ISO string is fine
                              'Asia/Kolkata',            // GMT+5:30
                              'PPp'                  // e.g. "May 30, 2025 at 11:55 AM GMT+5:30"
                            )}
                          </span>

                        </div>
                        <span>Tokens: {analysis.tokensAnalyzed}</span>
                        <span>Matches: {analysis.matchingSegments}</span>
                        {analysis.variableRenaming && (
                          <span className="text-accent">Variable Renaming Detected</span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Structural: </span>
                          <span className="font-medium">{analysis.structuralSimilarity}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Control Flow: </span>
                          <span className="font-medium">{analysis.controlFlow}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Logic Patterns: </span>
                          <span className="font-medium">{analysis.logicPatterns}%</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setSelectedAnalysis(analysis)}
                      className="ml-4"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}