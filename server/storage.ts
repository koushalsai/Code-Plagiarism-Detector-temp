import { plagiarismAnalyses, type PlagiarismAnalysis, type InsertPlagiarismAnalysis } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Plagiarism analysis methods
  createPlagiarismAnalysis(analysis: InsertPlagiarismAnalysis): Promise<PlagiarismAnalysis>;
  getPlagiarismAnalysis(id: number): Promise<PlagiarismAnalysis | undefined>;
  getRecentPlagiarismAnalyses(userId: string, limit?: number): Promise<PlagiarismAnalysis[]>;
}

export class DatabaseStorage implements IStorage {
  async createPlagiarismAnalysis(analysis: InsertPlagiarismAnalysis): Promise<PlagiarismAnalysis> {
    const [plagiarismAnalysis] = await db
      .insert(plagiarismAnalyses)
      .values(analysis)
      .returning();
    return plagiarismAnalysis;
  }

  async getPlagiarismAnalysis(id: number): Promise<PlagiarismAnalysis | undefined> {
    const [analysis] = await db.select().from(plagiarismAnalyses).where(eq(plagiarismAnalyses.id, id));
    return analysis || undefined;
  }

  async getRecentPlagiarismAnalyses(userId: string, limit: number = 10): Promise<PlagiarismAnalysis[]> {
    const analyses = await db
      .select()
      .from(plagiarismAnalyses)
      .where(eq(plagiarismAnalyses.userId, userId))
      .orderBy(desc(plagiarismAnalyses.createdAt))
      .limit(limit);
    return analyses;
  }
}

export const storage = new DatabaseStorage();