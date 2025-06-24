import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

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

interface ResultsSectionProps {
  result: AnalysisResult;
  selectedLanguage: string;
}

export default function ResultsSection({ result, selectedLanguage }: ResultsSectionProps) {
  const [showAllMatches, setShowAllMatches] = useState(false);

  const getSimilarityColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-orange-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const getSimilarityBg = (percentage: number) => {
    if (percentage >= 80) return "from-red-50 to-orange-50 border-red-200";
    if (percentage >= 60) return "from-orange-50 to-yellow-50 border-orange-200";
    if (percentage >= 40) return "from-yellow-50 to-blue-50 border-yellow-200";
    return "from-green-50 to-blue-50 border-green-200";
  };

  const getSimilarityProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-orange-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getSimilarityProgressBg = (percentage: number) => {
    if (percentage >= 80) return "bg-red-200";
    if (percentage >= 60) return "bg-orange-200";
    if (percentage >= 40) return "bg-yellow-200";
    return "bg-green-200";
  };

  const getSimilarityStatus = (percentage: number) => {
    if (percentage >= 80) return "High Plagiarism Detected";
    if (percentage >= 60) return "Moderate Plagiarism Detected";
    if (percentage >= 40) return "Low Plagiarism Detected";
    return "Minimal Similarity";
  };

  const getSimilarityDescription = (percentage: number) => {
    if (percentage >= 80) return "High similarity detected between code samples";
    if (percentage >= 60) return "Moderate similarity detected between code samples";
    if (percentage >= 40) return "Low similarity detected between code samples";
    return "Minimal similarity detected between code samples";
  };

  const displayedMatches = showAllMatches ? result.matches : result.matches.slice(0, 1);

  return (
    <Card className="shadow-sm border-border dark:border-muted mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Analysis Results</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>Analysis completed in {result.analysisTime}</span>
          </div>
        </div>

        {/* Similarity Score */}
        <div className={`bg-gradient-to-r ${getSimilarityBg(result.similarityPercentage)} rounded-lg p-6 mb-6 border`}> 
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${getSimilarityColor(result.similarityPercentage)}`}>
              {getSimilarityStatus(result.similarityPercentage)}
            </h3>
            <div className={`text-3xl font-bold ${getSimilarityColor(result.similarityPercentage)}`}> 
              {result.similarityPercentage}%
            </div>
          </div>
          <div className={`w-full ${getSimilarityProgressBg(result.similarityPercentage)} rounded-full h-3`}>  
            <div
              className={`${getSimilarityProgressColor(result.similarityPercentage)} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${result.similarityPercentage}%` }}
            />
          </div>
          <p className={`text-sm mt-2 ${getSimilarityColor(result.similarityPercentage).replace('text-','text-').replace('-600','-700')}`}>
            {getSimilarityDescription(result.similarityPercentage)}
          </p>
        </div>

        {/* Detailed Analysis */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Detection Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Structural Similarity:</span>
                <span className="font-medium text-foreground">{result.structuralSimilarity}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Variable Renaming:</span>
                <span className={`font-medium ${result.variableRenaming ? 'text-accent' : 'text-foreground'}`}> 
                  {result.variableRenaming ? 'Detected' : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Control Flow:</span>
                <span className="font-medium text-foreground">{result.controlFlow}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Logic Patterns:</span>
                <span className="font-medium text-foreground">{result.logicPatterns}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Analysis Metadata</h4>
              <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Algorithm:</span>
                <span className="font-medium text-foreground">MOSS Winnowing</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Language:</span>
                <span className="font-medium text-foreground capitalize">{selectedLanguage}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tokens Analyzed:</span>
                <span className="font-medium text-foreground">{result.tokensAnalyzed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Matching Segments:</span>
                <span className="font-medium text-foreground">{result.matchingSegments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Matching Code Segments */}
        {result.matches.length > 0 && (
          <div className="border-t border-border dark:border-muted pt-6">
            <h4 className="font-semibold text-foreground mb-4">Matching Code Segments</h4>
            
            {displayedMatches.map((match) => (
              <div key={match.id} className="bg-muted rounded-lg dark:bg-card p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Match #{match.id}</span>
                  <span className="text-sm text-muted-foreground">
                    Lines {match.code1Lines} vs {match.code2Lines}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Sample 1:</div>
                    <pre className="bg-background dark:bg-card text-foreground p-3 rounded text-xs font-mono overflow-x-auto">
                      <code>{match.code1Content}</code>
                    </pre>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2">Sample 2:</div>
                    <pre className="bg-background dark:bg-card text-foreground p-3 rounded text-xs font-mono overflow-x-auto">
                      <code>{match.code2Content}</code>
                    </pre>
                  </div>
                </div>
                {match.variableChanges.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    <AlertTriangle className="w-3 h-3 text-accent mr-1 inline" />
                    Variable changes detected: {match.variableChanges.join(', ')}
                  </div>
                )}
              </div>
            ))}

            {result.matches.length > 1 && (
              <Button
                variant="ghost"
                onClick={() => setShowAllMatches(!showAllMatches)}
                className="text-sm text-primary hover:text-primary-foreground font-medium"
              >
                {showAllMatches ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Hide additional segments
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show all {result.matchingSegments} matching segments
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
