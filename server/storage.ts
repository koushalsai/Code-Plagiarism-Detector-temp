import { users, plagiarismAnalyses, type User, type InsertUser, type PlagiarismAnalysis, type InsertPlagiarismAnalysis } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Plagiarism analysis methods
  createPlagiarismAnalysis(analysis: InsertPlagiarismAnalysis): Promise<PlagiarismAnalysis>;
  getPlagiarismAnalysis(id: number): Promise<PlagiarismAnalysis | undefined>;
  getRecentPlagiarismAnalyses(userId: string, limit?: number): Promise<PlagiarismAnalysis[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

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
