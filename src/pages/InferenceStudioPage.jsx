import { useState } from "react";
import { PAGE_ILLUSTRATIONS } from "../lib/illustrations";

const MODELS = [
  { id: "bert-sentiment-v2", label: "bert-sentiment-v2", type: "text", category: "Text Classification" },
  { id: "vit-imagenet", label: "vit-imagenet", type: "vision", category: "Image Classification" },
  { id: "whisper-swahili", label: "whisper-swahili", type: "audio", category: "Speech Recognition" },
  { id: "gpt2-finetuned", label: "gpt2-finetuned", type: "text", category: "Text Generation" },
];

const MOCK_RESULTS = {
  "bert-sentiment-v2": {
    response: { label: "POSITIVE", score: 0.9823 },
    explanation: "The model classified this input as POSITIVE with 98.23% confidence based on sentiment markers in the text.",
    tokens: [
      { word: "The", sentiment: "neutral" },
      { word: "product", sentiment: "neutral" },
      { word: "is", sentiment: "neutral" },
      { word: "absolutely", sentiment: "positive" },
      { word: "fantastic", sentiment: "positive" },
      { word: "and", sentiment: "neutral" },
      { word: "works", sentiment: "neutral" },
      { word: "great", sentiment: "positive" },
    ],
  },
  "vit-imagenet": {
    response: { predictions: [{ class: "tabby_cat", confidence: 0.891 }, { class: "tiger_cat", confidence: 0.073 }] },
    explanation: "The vision transformer identified the dominant object with 89.1% confidence by attending to texture and shape features.",
    tokens: [],
  },
  "whisper-swahili": {
    response: { text: "Habari yako leo?" },
    explanation: "The audio was transcribed using the Whisper model fine-tuned on Swahili speech data.",
    tokens: [],
  },
  "gpt2-finetuned": {
    response: { generated_text: "The future of AI is bright, with transformative applications across healthcare, education, and scientific research driving unprecedented progress." },
    explanation: "The model generated a continuation based on the provided prompt using autoregressive decoding with temperature 0.7.",
    tokens: [
      { word: "future", sentiment: "positive" },
      { word: "of", sentiment: "neutral" },
      { word: "AI", sentiment: "positive" },
      { word: "is", sentiment: "neutral" },
      { word: "transformative", sentiment: "positive" },
      { word: "challenging", sentiment: "negative" },
      { word: "yet", sentiment: "neutral" },
      { word: "promising", sentiment: "positive" },
    ],
  },
};

const sentimentChipStyle = (sentiment) => {
  if (sentiment === "positive") return { background: "#dcfce7", color: "#166534" };
  if (sentiment === "negative") return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#f3f0ea", color: "#56524a" };
};

export default function InferenceStudioPage() {
  const [selectedModelId, setSelectedModelId] = useState("bert-sentiment-v2");
  const [textInput, setTextInput] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(256);
  const [topP, setTopP] = useState(0.9);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [latency, setLatency] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const selectedModel = MODELS.find((m) => m.id === selectedModelId);

  const handleRun = () => {
    setLoading(true);
    setResult(null);
    const start = Date.now();
    setTimeout(() => {
      const elapsed = Date.now() - start;
      setResult(MOCK_RESULTS[selectedModelId]);
      setLatency(elapsed);
      setLoading(false);
    }, 800);
  };

  const tokenCount = textInput.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#f1ede4", fontFamily: "'Inter', sans-serif" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1b1a17 0%, #2d2b25 50%, #3a1f10 100%)",
          padding: "48px 28px 40px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: "#cf5a2a",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>▶</div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>Inference Studio</h1>
            </div>
            <p style={{ margin: 0, color: "#a09890", fontSize: 15 }}>Interactive model playground — run live inference on deployed models</p>
          </div>
          <img
            src={PAGE_ILLUSTRATIONS.inference}
            alt="Inference studio illustration"
            style={{ width: "100%", borderRadius: 12, display: "block", opacity: 0.95 }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e7e0d2",
              borderRadius: 16,
              padding: 28,
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#1b1a17" }}>Input</h2>
              <p style={{ margin: 0, fontSize: 13, color: "#8a857a" }}>Configure your model and provide input data</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#56524a", marginBottom: 6 }}>
                Model
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => { setSelectedModelId(e.target.value); setResult(null); setLatency(null); }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #e7e0d2",
                  background: "#faf9f6",
                  fontSize: 14,
                  color: "#1b1a17",
                  appearance: "none",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a857a' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} — {m.category}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: "#fdf0e8",
                    color: "#cf5a2a",
                    border: "1px solid #f5d5c0",
                  }}
                >
                  {selectedModel.category}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 20,
                    background: "#f0fdf4",
                    color: "#166534",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  Deployed
                </span>
              </div>
            </div>

            {selectedModel.type === "text" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#56524a", marginBottom: 6 }}>
                  Text Input
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text input..."
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 8,
                    border: "1px solid #e7e0d2",
                    background: "#faf9f6",
                    fontSize: 14,
                    color: "#1b1a17",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}
                />
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#8a857a" }}>
                  {tokenCount} token{tokenCount !== 1 ? "s" : ""} estimated
                </p>
              </div>
            )}

            {selectedModel.type === "vision" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#56524a", marginBottom: 6 }}>
                  Image Input
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                  style={{
                    border: `2px dashed ${dragOver ? "#cf5a2a" : "#e7e0d2"}`,
                    borderRadius: 10,
                    padding: "36px 24px",
                    textAlign: "center",
                    background: dragOver ? "#fdf5f0" : "#faf9f6",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🖼️</div>
                  <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#1b1a17" }}>
                    Drop image here
                  </p>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: "#8a857a" }}>
                    PNG, JPG, WebP up to 10MB
                  </p>
                  <button
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid #e7e0d2",
                      background: "#fff",
                      fontSize: 13,
                      color: "#56524a",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Browse files
                  </button>
                </div>
              </div>
            )}

            {selectedModel.type === "audio" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#56524a", marginBottom: 6 }}>
                  Audio Input
                </label>
                <div
                  style={{
                    border: "2px dashed #e7e0d2",
                    borderRadius: 10,
                    padding: "36px 24px",
                    textAlign: "center",
                    background: "#faf9f6",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🎙️</div>
                  <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#1b1a17" }}>
                    Drop audio file here
                  </p>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: "#8a857a" }}>
                    MP3, WAV, M4A up to 25MB
                  </p>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid #e7e0d2",
                        background: "#fff",
                        fontSize: 13,
                        color: "#56524a",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Browse files
                    </button>
                    <button
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid #cf5a2a",
                        background: "#fdf5f0",
                        fontSize: 13,
                        color: "#cf5a2a",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      ● Record
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => setAdvancedOpen(!advancedOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#56524a",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transform: advancedOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    fontSize: 10,
                  }}
                >
                  ▶
                </span>
                Advanced Parameters
              </button>

              {advancedOpen && (
                <div
                  style={{
                    marginTop: 14,
                    padding: 16,
                    background: "#faf9f6",
                    borderRadius: 10,
                    border: "1px solid #e7e0d2",
                  }}
                >
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#56524a" }}>Temperature</label>
                      <span style={{ fontSize: 13, color: "#cf5a2a", fontWeight: 600 }}>{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={2}
                      step={0.1}
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      style={{ width: "100%", accentColor: "#cf5a2a" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a857a" }}>
                      <span>0</span>
                      <span>2</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#56524a" }}>Max Tokens</label>
                      <span style={{ fontSize: 13, color: "#cf5a2a", fontWeight: 600 }}>{maxTokens}</span>
                    </div>
                    <input
                      type="range"
                      min={32}
                      max={1024}
                      step={32}
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "#cf5a2a" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a857a" }}>
                      <span>32</span>
                      <span>1024</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: "#56524a" }}>Top-p</label>
                      <span style={{ fontSize: 13, color: "#cf5a2a", fontWeight: 600 }}>{topP}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                      style={{ width: "100%", accentColor: "#cf5a2a" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8a857a" }}>
                      <span>0</span>
                      <span>1</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRun}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: loading ? "#e5b89e" : "#cf5a2a",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
                letterSpacing: "0.2px",
              }}
            >
              {loading ? "Running..." : "Run Inference ▶"}
            </button>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e7e0d2",
              borderRadius: 16,
              padding: 28,
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#1b1a17" }}>Response</h2>
              <p style={{ margin: 0, fontSize: 13, color: "#8a857a" }}>Model output and interpretability</p>
            </div>

            {!loading && !result && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 24px",
                  textAlign: "center",
                  border: "1px dashed #e7e0d2",
                  borderRadius: 12,
                  background: "#faf9f6",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.5 }}>▶</div>
                <p style={{ margin: 0, fontSize: 14, color: "#8a857a", lineHeight: 1.6 }}>
                  Run the model to see results here.
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#b0aaa2" }}>
                  Select a model and click Run Inference
                </p>
              </div>
            )}

            {loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "3px solid #e7e0d2",
                    borderTopColor: "#cf5a2a",
                    animation: "spin 0.8s linear infinite",
                    marginBottom: 16,
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#56524a" }}>Running inference...</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#8a857a" }}>Processing with {selectedModel.label}</p>
              </div>
            )}

            {!loading && result && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#8a857a", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                      JSON Output
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: "#f0fdf4",
                        color: "#166534",
                        border: "1px solid #bbf7d0",
                        fontWeight: 600,
                      }}
                    >
                      200 OK
                    </span>
                  </div>
                  <pre
                    style={{
                      background: "#1b1a17",
                      color: "#a8d8a8",
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      padding: 16,
                      borderRadius: 10,
                      fontSize: 13,
                      margin: 0,
                      overflowX: "auto",
                      lineHeight: 1.7,
                    }}
                  >
                    {JSON.stringify(result.response, null, 2)}
                  </pre>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #f0ebe2",
                    paddingTop: 20,
                    marginBottom: 20,
                  }}
                >
                  <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "#1b1a17", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Explanation
                  </h4>
                  <p style={{ margin: "0 0 14px", fontSize: 14, color: "#56524a", lineHeight: 1.7 }}>
                    {result.explanation}
                  </p>

                  {result.tokens && result.tokens.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#8a857a" }}>
                        Token Attribution
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {result.tokens.map((token, i) => (
                          <span
                            key={i}
                            style={{
                              ...sentimentChipStyle(token.sentiment),
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 13,
                              fontWeight: 500,
                              display: "inline-block",
                            }}
                          >
                            {token.word}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#dcfce7", border: "1px solid #bbf7d0", display: "inline-block" }} />
                          <span style={{ fontSize: 11, color: "#8a857a" }}>Positive</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fee2e2", border: "1px solid #fecaca", display: "inline-block" }} />
                          <span style={{ fontSize: 11, color: "#8a857a" }}>Negative</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f3f0ea", border: "1px solid #e7e0d2", display: "inline-block" }} />
                          <span style={{ fontSize: 11, color: "#8a857a" }}>Neutral</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: "12px 20px",
            background: "#fff",
            border: "1px solid #e7e0d2",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 13,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: result ? "#22c55e" : "#8a857a",
                display: "inline-block",
              }}
            />
            <span style={{ color: "#56524a", fontWeight: 500 }}>Model:</span>
            <span style={{ color: "#1b1a17", fontWeight: 600 }}>{selectedModel.label}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#56524a", fontWeight: 500 }}>Latency:</span>
            <span style={{ color: result ? "#cf5a2a" : "#8a857a", fontWeight: 600 }}>
              {result ? `${latency}ms` : "—"}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#56524a", fontWeight: 500 }}>Tokens processed:</span>
            <span style={{ color: result ? "#1b1a17" : "#8a857a", fontWeight: 600 }}>
              {result ? (selectedModel.type === "text" ? Math.max(tokenCount, 12) : "N/A") : "—"}
            </span>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#56524a", fontWeight: 500 }}>Endpoint:</span>
            <code style={{ fontSize: 12, background: "#f3f0ea", padding: "2px 8px", borderRadius: 4, color: "#56524a" }}>
              /api/v1/inference/{selectedModelId}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
