import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy-initialized Gemini client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI client:", err);
      return null;
    }
  }
  return genAI;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Zynetra Analytics Engine",
    geminiAvailable: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Autonomous AI analysis endpoint
app.post(["/api/zynetra/analyze", "/api/aura/analyze", "/api/autonomous-analysis"], async (req, res) => {
  try {
    const { datasetProfile, objective, samples, columns, sampleRows, datasetName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "statistical_engine",
        message: "Generated using autonomous built-in statistical heuristics (Gemini key not configured or optional).",
        data: null,
      });
    }

    const effectiveProfile = datasetProfile || { name: datasetName, columns };
    const effectiveSamples = samples || sampleRows || [];

    const prompt = `You are Zynetra, an autonomous enterprise analytics co-pilot.
Given the following dataset summary and business objective:
Objective: ${objective || "Perform comprehensive diagnostic and root-cause analysis"}
Dataset Profile: ${JSON.stringify(effectiveProfile).slice(0, 3000)}
Sample Records: ${JSON.stringify(effectiveSamples).slice(0, 1500)}

Please return a strictly valid JSON object with the following schema:
{
  "executiveSummary": "Concise 3-sentence executive summary of the critical data patterns and findings.",
  "rootCauseAnalysis": {
    "primarySymptom": "Main issue observed in the metrics",
    "directDrivers": [
      {
        "factor": "Driver name",
        "impactPercentage": 42,
        "evidence": "Specific metric or column observation supporting this",
        "confidence": 89,
        "alternativeHypothesis": "What else was evaluated and ruled out"
      }
    ],
    "underlyingSystemicCause": "The core systemic breakdown or strategic gap"
  },
  "prioritizedRecommendations": [
    {
      "id": "rec-1",
      "priority": "P1",
      "title": "Action title",
      "expectedImpact": "+$320K ARR or -15% Churn",
      "estimatedBenefit": "Clear ROI statement",
      "riskLevel": "Low",
      "confidenceScore": 92,
      "timeframe": "0-30 days",
      "why": "Detailed rationale backed by evidence",
      "supportingData": "Exact metrics and values observed",
      "assumptions": "Assumptions underpinning this advice",
      "limitations": "Potential constraints or boundary conditions",
      "actionSteps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "macroContextCorrelation": {
    "detectedTrend": "External or market dynamic relevant to this dataset",
    "correlationScore": 85,
    "explanation": "How macroeconomic or industry dynamics align with this data pattern"
  }
}
Respond ONLY with the raw JSON object. Do not wrap in markdown quotes if possible or ensure valid JSON syntax.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    let parsed;
    try {
      parsed = JSON.parse(responseText.trim());
    } catch {
      // Fallback clean
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }

    return res.json({
      success: true,
      source: "gemini-3.8-flash",
      data: parsed,
    });
  } catch (error: any) {
    console.error("AI analysis error:", error);
    return res.json({
      success: true,
      source: "fallback_statistical",
      error: error?.message,
      data: null,
    });
  }
});

// News and macro context correlation endpoint
app.post(["/api/zynetra/news-correlate", "/api/aura/news-correlate"], async (req, res) => {
  try {
    const { datasetDomain, anomalies } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "simulated_feeds",
        correlations: [
          {
            headline: "West Coast Port Logistical Slowdown Impacts Component Lead Times",
            source: "Supply Chain Digest",
            date: "2024-Q3",
            relevanceScore: 94,
            impact: "Directly explains the 22-day delivery variance surge in regional fulfillment data.",
            type: "Supply Chain Disruption",
          },
          {
            headline: "Cloud Infrastructure Pricing Revision Across Tier 1 Providers",
            source: "Tech Industry Monitor",
            date: "2024-Q2",
            relevanceScore: 88,
            impact: "Correlates with the unexpected 14.8% gross margin contraction in compute-heavy customer cohorts.",
            type: "Market Shift",
          },
        ],
      });
    }

    const prompt = `You are an enterprise intelligence engine. Given the domain: "${datasetDomain}" and observed anomalies: ${JSON.stringify(anomalies)}, identify 2-3 realistic macro/news events that correlate with these deviations.
Return valid JSON array of objects:
[
  {
    "headline": "...",
    "source": "...",
    "date": "...",
    "relevanceScore": 88,
    "impact": "...",
    "type": "..."
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({
      success: true,
      source: "gemini-3.8-flash",
      correlations: parsed,
    });
  } catch (err: any) {
    return res.json({
      success: false,
      error: err.message,
      correlations: [],
    });
  }
});

async function startServer() {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    !process.argv[1]?.endsWith("server.ts");

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Zynetra] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
