import React, { useState, useRef } from "react";
import { aiQuery } from "../utils/api";

const Logo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" rx="6" fill="#4F46E5" />
    <path
      d="M6 15c3-1 6-1 9-2 1-0.5 2-1.5 3-2.5"
      stroke="#fff"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="9" r="1" fill="#fff" />
  </svg>
);

export default function AIChat({ tripId, onActivityCreated }) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const pendingRef = useRef(false);

  const quickPrompts = tripId
    ? [
        "Suggest activities for Day 1",
        "Reduce cost for this trip",
        "What should I pack?",
        "Things to do in Paris",
      ]
    : [
        "What should I pack?",
        "Things to do in Paris",
        "Budget tips for travel",
        "Best time to visit London",
      ];

  const send = async (text) => {
    if (!text || !text.trim() || pendingRef.current) return;

    pendingRef.current = true;
    setLoading(true);
    try {
      const res = await aiQuery({ tripId, message: text });
      const payload = res.data;
      setHistory((h) => [...h, { user: text, response: payload }]);
      setMessage("");

      // Trigger refresh if activity was created
      if (
        payload.intent === "create_activity" &&
        payload.result &&
        payload.result.created &&
        onActivityCreated
      ) {
        onActivityCreated();
      }
    } catch (err) {
      const serverErr = err?.response?.data || {
        error: true,
        message: "Request failed",
      };
      setHistory((h) => [...h, { user: text, response: serverErr }]);
    } finally {
      setLoading(false);
      pendingRef.current = false;
    }
  };

  return (
    <div
      style={{
        width: "100%",
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <Logo />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>
            AI Travel Assistant
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            Context-aware suggestions for your trips
          </div>
        </div>
      </div>

      <div
        style={{
          maxHeight: 300,
          overflow: "auto",
          padding: 8,
          background: "#f8fafc",
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        {history.length === 0 && (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            Ask something about your trip or try a quick prompt below.
          </div>
        )}
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#111827", fontWeight: 600 }}>
              You
            </div>
            <div style={{ marginTop: 4, marginBottom: 6 }}>{h.user}</div>
            <div style={{ fontSize: 12, color: "#111827", fontWeight: 600 }}>
              Assistant
            </div>
            <div style={{ marginTop: 4 }}>
              {/* Handle create_activity response */}
              {h.response &&
              h.response.intent === "create_activity" &&
              h.response.result &&
              h.response.result.created ? (
                <div style={{ color: "#059669", fontWeight: 500 }}>
                  ✅ Activity "{h.response.result.activity.title}" added
                  successfully!
                </div>
              ) : h.response &&
                h.response.intent === "create_activity" &&
                h.response.result &&
                h.response.result.error ? (
                <div style={{ color: "#dc2626", fontWeight: 500 }}>
                  ❌ {h.response.result.message || h.response.result.error}
                </div>
              ) : h.response &&
                h.response.result &&
                h.response.result.message ? (
                <div style={{ color: "#374151" }}>
                  {h.response.result.message}
                </div>
              ) : h.response &&
                h.response.result &&
                h.response.result.suggestions ? (
                <ul style={{ marginTop: 6 }}>
                  {h.response.result.suggestions.map((s, idx) => {
                    // Handle both string suggestions (city) and object suggestions (activities)
                    const isObject = typeof s === "object" && s !== null;
                    return (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        {isObject ? (
                          <div>
                            <div style={{ fontWeight: 600 }}>{s.title}</div>
                            <div
                              style={{
                                fontSize: 12,
                                color: "#6b7280",
                                marginTop: 2,
                              }}
                            >
                              {s.estimatedDurationMinutes &&
                                `⏱ ${s.estimatedDurationMinutes} min`}
                              {s.cost && ` • $${s.cost}`}
                              {s.type && ` • ${s.type}`}
                            </div>
                            {s.note && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#4b5563",
                                  marginTop: 2,
                                }}
                              >
                                {s.note}
                              </div>
                            )}
                          </div>
                        ) : (
                          s
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : h.response && h.response.result && h.response.result.tips ? (
                <ul style={{ marginTop: 6 }}>
                  {h.response.result.tips.map((t, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      {t}
                    </li>
                  ))}
                </ul>
              ) : h.response && h.response.message ? (
                <div style={{ color: "#374151" }}>{h.response.message}</div>
              ) : (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    background: "#fff",
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  {JSON.stringify(h.response, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            style={{
              padding: "6px 8px",
              background: "#eef2ff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Ask about this trip (e.g. "Add a museum visit on Day 1 at 11 AM")`}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #e6e9ef",
          }}
          onKeyDown={(e) => e.key === "Enter" && send(message)}
        />
        <button
          onClick={() => send(message)}
          disabled={loading}
          style={{
            padding: "8px 12px",
            background: "#4F46E5",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
