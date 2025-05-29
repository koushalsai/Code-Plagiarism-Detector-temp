import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Plagiarism analysis results schema
export const plagiarismAnalyses = pgTable("plagiarism_analyses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  language: text("language").notNull(),
  code1: text("code1").notNull(),
  code2: text("code2").notNull(),
  similarityPercentage: integer("similarity_percentage").notNull(),
  structuralSimilarity: integer("structural_similarity").notNull(),
  controlFlow: integer("control_flow").notNull(),
  logicPatterns: integer("logic_patterns").notNull(),
  variableRenaming: boolean("variable_renaming").notNull(),
  tokensAnalyzed: integer("tokens_analyzed").notNull(),
  matchingSegments: integer("matching_segments").notNull(),
  matches: jsonb("matches").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const analyzePlagiarismSchema = z.object({
  language: z.enum(["javascript", "python", "java", "cpp", "csharp"]),
  code1: z.string().min(1, "First code sample is required"),
  code2: z.string().min(1, "Second code sample is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const insertPlagiarismAnalysisSchema = createInsertSchema(plagiarismAnalyses).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AnalyzePlagiarismRequest = z.infer<typeof analyzePlagiarismSchema>;
export type PlagiarismAnalysis = typeof plagiarismAnalyses.$inferSelect;
export type InsertPlagiarismAnalysis = z.infer<typeof insertPlagiarismAnalysisSchema>;

// Match segment type
export interface MatchSegment {
  id: number;
  code1Lines: string;
  code2Lines: string;
  code1Content: string;
  code2Content: string;
  variableChanges: string[];
}
