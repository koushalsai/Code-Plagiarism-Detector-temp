import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePlagiarism } from "./controllers/plagiarismController";

export async function registerRoutes(app: Express): Promise<Server> {
    app.get("/api", (_req, res) => {
    res.json({
      message: "API is working",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });
  // Plagiarism detection routes
  app.post("/api/plagiarism/analyze", analyzePlagiarism);
  
  // Get recent analyses for a specific user
  app.get("/api/plagiarism/recent", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const limit = parseInt(req.query.limit as string) || 10;
      const analyses = await storage.getRecentPlagiarismAnalyses(userId, limit);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching recent analyses:", error);
      res.status(500).json({ message: "Failed to fetch recent analyses" });
    }
  });

  // Get specific analysis
  app.get("/api/plagiarism/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getPlagiarismAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }
      
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
