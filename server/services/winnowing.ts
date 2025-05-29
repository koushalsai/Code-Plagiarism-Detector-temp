import { tokenizeCode } from "../utils/tokenizers";
import type { MatchSegment } from "@shared/schema";

export interface WinnowingResult {
  similarityPercentage: number;
  structuralSimilarity: number;
  controlFlow: number;
  logicPatterns: number;
  variableRenaming: boolean;
  tokensAnalyzed: number;
  matchingSegments: number;
  matches: MatchSegment[];
}

export interface WinnowingOptions {
  kGramLength: number;
  windowSize: number;
  sensitivity: "low" | "medium" | "high";
}

export class MossWinnowing {
  private kGramLength: number;
  private windowSize: number;
  private sensitivity: "low" | "medium" | "high";

  constructor(options: WinnowingOptions) {
    this.kGramLength = options.kGramLength;
    this.windowSize = options.windowSize;
    this.sensitivity = options.sensitivity;
  }

  analyze(code1: string, code2: string, language: string): WinnowingResult {
    // Tokenize both code samples
    const tokens1 = tokenizeCode(code1, language);
    const tokens2 = tokenizeCode(code2, language);

    // Generate k-grams
    const kGrams1 = this.generateKGrams(tokens1);
    const kGrams2 = this.generateKGrams(tokens2);

    // Generate fingerprints using winnowing
    const fingerprints1 = this.winnow(kGrams1);
    const fingerprints2 = this.winnow(kGrams2);

    // Calculate similarity
    const similarity = this.calculateSimilarity(fingerprints1, fingerprints2);

    // Detect variable renaming
    const variableRenaming = this.detectVariableRenaming(tokens1, tokens2);

    // Calculate component similarities
    const structuralSimilarity = this.calculateStructuralSimilarity(tokens1, tokens2);
    const controlFlow = this.calculateControlFlowSimilarity(tokens1, tokens2);
    const logicPatterns = this.calculateLogicPatternSimilarity(tokens1, tokens2);

    // Find matching segments
    const matches = this.findMatchingSegments(code1, code2, tokens1, tokens2);

    return {
      similarityPercentage: Math.round(similarity * 100),
      structuralSimilarity: Math.round(structuralSimilarity * 100),
      controlFlow: Math.round(controlFlow * 100),
      logicPatterns: Math.round(logicPatterns * 100),
      variableRenaming,
      tokensAnalyzed: tokens1.length + tokens2.length,
      matchingSegments: matches.length,
      matches,
    };
  }

  private generateKGrams(tokens: string[]): string[] {
    const kGrams: string[] = [];
    for (let i = 0; i <= tokens.length - this.kGramLength; i++) {
      const kGram = tokens.slice(i, i + this.kGramLength).join(" ");
      kGrams.push(kGram);
    }
    return kGrams;
  }

  private winnow(kGrams: string[]): Set<number> {
    const hashes = kGrams.map(gram => this.simpleHash(gram));
    const fingerprints = new Set<number>();

    for (let i = 0; i <= hashes.length - this.windowSize; i++) {
      const window = hashes.slice(i, i + this.windowSize);
      const minHash = Math.min(...window);
      fingerprints.add(minHash);
    }

    return fingerprints;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private calculateSimilarity(fp1: Set<number>, fp2: Set<number>): number {
    const intersection = new Set([...fp1].filter(x => fp2.has(x)));
    const union = new Set([...fp1, ...fp2]);
    
    if (union.size === 0) return 0;
    return intersection.size / union.size;
  }

  private detectVariableRenaming(tokens1: string[], tokens2: string[]): boolean {
    // Simple heuristic: look for similar structure with different identifiers
    const identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    
    let identifierMismatches = 0;
    let totalIdentifiers = 0;

    const minLength = Math.min(tokens1.length, tokens2.length);
    
    for (let i = 0; i < minLength; i++) {
      const token1 = tokens1[i];
      const token2 = tokens2[i];
      
      if (identifierPattern.test(token1) && identifierPattern.test(token2)) {
        totalIdentifiers++;
        if (token1 !== token2) {
          identifierMismatches++;
        }
      }
    }

    return totalIdentifiers > 0 && (identifierMismatches / totalIdentifiers) > 0.3;
  }

  private calculateStructuralSimilarity(tokens1: string[], tokens2: string[]): number {
    const structure1 = this.extractStructure(tokens1);
    const structure2 = this.extractStructure(tokens2);
    
    return this.calculateSequenceSimilarity(structure1, structure2);
  }

  private extractStructure(tokens: string[]): string[] {
    const structuralTokens = [
      'function', 'class', 'if', 'else', 'for', 'while', 'switch', 'case',
      'try', 'catch', 'finally', 'return', '{', '}', '(', ')', ';'
    ];
    
    return tokens.filter(token => structuralTokens.includes(token));
  }

  private calculateControlFlowSimilarity(tokens1: string[], tokens2: string[]): number {
    const controlTokens = ['if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'return'];
    
    const control1 = tokens1.filter(token => controlTokens.includes(token));
    const control2 = tokens2.filter(token => controlTokens.includes(token));
    
    return this.calculateSequenceSimilarity(control1, control2);
  }

  private calculateLogicPatternSimilarity(tokens1: string[], tokens2: string[]): number {
    const operators = ['&&', '||', '!', '==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '%'];
    
    const logic1 = tokens1.filter(token => operators.includes(token));
    const logic2 = tokens2.filter(token => operators.includes(token));
    
    return this.calculateSequenceSimilarity(logic1, logic2);
  }

  private calculateSequenceSimilarity(seq1: string[], seq2: string[]): number {
    if (seq1.length === 0 && seq2.length === 0) return 1;
    if (seq1.length === 0 || seq2.length === 0) return 0;

    // Simple LCS-based similarity
    const lcs = this.longestCommonSubsequence(seq1, seq2);
    const maxLength = Math.max(seq1.length, seq2.length);
    
    return lcs / maxLength;
  }

  private longestCommonSubsequence(seq1: string[], seq2: string[]): number {
    const dp: number[][] = Array(seq1.length + 1)
      .fill(null)
      .map(() => Array(seq2.length + 1).fill(0));

    for (let i = 1; i <= seq1.length; i++) {
      for (let j = 1; j <= seq2.length; j++) {
        if (seq1[i - 1] === seq2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    return dp[seq1.length][seq2.length];
  }

  private findMatchingSegments(code1: string, code2: string, tokens1: string[], tokens2: string[]): MatchSegment[] {
    const matches: MatchSegment[] = [];
    const lines1 = code1.split('\n');
    const lines2 = code2.split('\n');

    // Simple approach: find consecutive matching tokens
    let matchId = 1;
    let i = 0, j = 0;

    while (i < tokens1.length && j < tokens2.length) {
      if (tokens1[i] === tokens2[j]) {
        let matchLength = 0;
        let startI = i;
        let startJ = j;

        // Extend the match
        while (i < tokens1.length && j < tokens2.length && tokens1[i] === tokens2[j]) {
          matchLength++;
          i++;
          j++;
        }

        // If match is significant, record it
        if (matchLength >= 3) {
          const code1Content = tokens1.slice(startI, i).join(' ');
          const code2Content = tokens2.slice(startJ, j).join(' ');

          matches.push({
            id: matchId++,
            code1Lines: `${Math.floor(startI / 10) + 1}-${Math.floor(i / 10) + 1}`,
            code2Lines: `${Math.floor(startJ / 10) + 1}-${Math.floor(j / 10) + 1}`,
            code1Content,
            code2Content,
            variableChanges: [],
          });
        }
      } else {
        i++;
        j++;
      }
    }

    return matches;
  }
}

export function createWinnowingAnalyzer(sensitivity: "low" | "medium" | "high"): MossWinnowing {
  const options: WinnowingOptions = {
    kGramLength: sensitivity === "low" ? 5 : sensitivity === "medium" ? 4 : 3,
    windowSize: sensitivity === "low" ? 6 : sensitivity === "medium" ? 5 : 4,
    sensitivity,
  };

  return new MossWinnowing(options);
}
