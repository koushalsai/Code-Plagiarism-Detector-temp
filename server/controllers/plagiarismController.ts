import { Request, Response } from "express";
import { analyzePlagiarismSchema } from "@shared/schema";
import { storage } from "../storage";
import { createWinnowingAnalyzer } from "../services/winnowing";
import { ZodError } from "zod";

export async function analyzePlagiarism(req: Request, res: Response) {
  try {
    // Validate request body
    const data = analyzePlagiarismSchema.parse(req.body);
    
    // Create winnowing analyzer with medium sensitivity (default)
    const analyzer = createWinnowingAnalyzer("medium");
    
    // Perform analysis
    const result = analyzer.analyze(data.code1, data.code2, data.language);
    
    // Store analysis result with user ID
    const analysis = await storage.createPlagiarismAnalysis({
      userId: data.userId,
      language: data.language,
      code1: data.code1,
      code2: data.code2,
      similarityPercentage: result.similarityPercentage,
      structuralSimilarity: result.structuralSimilarity,
      controlFlow: result.controlFlow,
      logicPatterns: result.logicPatterns,
      variableRenaming: result.variableRenaming,
      tokensAnalyzed: result.tokensAnalyzed,
      matchingSegments: result.matchingSegments,
      matches: result.matches as any, // Type assertion for jsonb field
    });

    res.json({
      id: analysis.id,
      ...result,
      analysisTime: "2-3 seconds",    // fallback duration
      createdAt:    analysis.createdAt.toISOString(),    // <-- the real timestamp
    });

  } catch (error) {
    console.error("Error analyzing plagiarism:", error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    
    res.status(500).json({
      message: "Failed to analyze code for plagiarism",
    });
  }
}
