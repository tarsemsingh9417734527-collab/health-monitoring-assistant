import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  const [analytics, setAnalytics] = useState({
    active_medications: 0,
    total_doses_recorded: 0,
    total_health_metrics: 0,
    medications: [],
    recent_doses: [],
    recent_metrics: [],
  });

  const [insights, setInsights] = useState([]);

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! I'm your Smart Health Assistant. You can ask me about medications, health records, weather, or general health information.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const [voiceStatus, setVoiceStatus] =
    useState("Voice assistant ready.");

  const [apiStatus, setApiStatus] =
    useState("Checking...");

  useEffect(() => {
    loadHealthData();
  }, []);

  async function loadHealthData() {
    try {
      const analyticsResponse =
        await fetch(`${API}/analytics`);

      const analyticsData =
        await analyticsResponse.json();

      const insightsResponse =
        await fetch(`${API}/insights`);

      const insightsData =
        await insightsResponse.json();

      setAnalytics(analyticsData);

      setInsights(insightsData.insights || []);

      setApiStatus("Connected ✓");
    } catch (error) {
      console.error(error);
      setApiStatus("Connection failed ✗");
    }
  }

  async function askQuestion() {
    const text = question.trim();

    if (!text || loading) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: text,
      },
    ]);

    setQuestion("");

    setLoading(true);

    try {
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((previous) => [
          ...previous,
          {
            type: "ai",
            text: data.answer,
          },
        ]);
      } else {
        setMessages((previous) => [
          ...previous,
          {
            type: "ai",
            text: "Sorry, I couldn't process your question.",
          },
        ]);
      }
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: "Unable to connect to the Health Assistant API.",
        },
      ]);
    }

    setLoading(false);
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      askQuestion();
    }
  }

  function startVoiceRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus(
        "Voice recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setVoiceStatus(
      "🎤 Listening... Please speak your question."
    );

    recognition.start();

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setQuestion(transcript);

      setVoiceStatus(
        "Voice converted to text. Sending to AI..."
      );

      setTimeout(() => {
        sendVoiceQuestion(transcript);
      }, 100);
    };

    recognition.onerror = (event) => {
      console.error(event.error);

      setVoiceStatus(
        "Voice recognition error: " + event.error
      );
    };

    recognition.onend = () => {
      setVoiceStatus("Voice assistant ready.");
    };
  }

  async function sendVoiceQuestion(text) {
    if (!text.trim()) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text: text,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((previous) => [
          ...previous,
          {
            type: "ai",
            text: data.answer,
          },
        ]);
      }
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: "Unable to connect to the Health Assistant API.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div className="app">

      <header className="header">
        <h1>Smart Health Assistant</h1>
        <p>AI-Powered Health Insights Dashboard</p>
      </header>

      <main className="container">

        {/* DASHBOARD CARDS */}

        <div className="cards">

          <div className="card">
            <h3>💊 Active Medications</h3>
            <div className="number">
              {analytics.active_medications}
            </div>
          </div>

          <div className="card">
            <h3>💉 Doses Recorded</h3>
            <div className="number">
              {analytics.total_doses_recorded}
            </div>
          </div>

          <div className="card">
            <h3>📊 Health Metrics</h3>
            <div className="number">
              {analytics.total_health_metrics}
            </div>
          </div>

        </div>


        {/* AI ASSISTANT */}

        <section className="section">

          <h2>🤖 AI Health Assistant</h2>

          <div className="chat">

            <div className="messages">

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.type === "user"
                      ? "message user"
                      : "message ai"
                  }
                >
                  {message.text}
                </div>
              ))}

              {loading && (
                <div className="message ai">
                  Thinking...
                </div>
              )}

            </div>


            <div className="chat-input">

              <input
                type="text"
                value={question}
                placeholder="Ask a health question..."
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                onKeyDown={handleEnter}
              />

              <button
                onClick={askQuestion}
              >
                Send
              </button>

              <button
                className="voice-button"
                onClick={startVoiceRecognition}
              >
                🎤 Voice
              </button>

            </div>


            <p className="voice-status">
              {voiceStatus}
            </p>

          </div>

        </section>


        {/* HEALTH INSIGHTS */}

        <section className="section">

          <h2>💡 Health Insights</h2>

          {insights.length === 0 ? (
            <div className="insight">
              No health insights available.
            </div>
          ) : (
            insights.map((insight, index) => (
              <div
                className="insight"
                key={index}
              >
                {insight}
              </div>
            ))
          )}

        </section>


        {/* MEDICATIONS */}

        <section className="section">

          <h2>💊 Current Medications</h2>

          {analytics.medications.length === 0 ? (
            <p>No active medications found.</p>
          ) : (
            <ul>
              {analytics.medications.map(
                (medicine) => (
                  <li key={medicine.id}>
                    <strong>
                      {medicine.name}
                    </strong>{" "}
                    -{" "}
                    {medicine.dosage ||
                      "No dosage"}{" "}
                    at {medicine.time}
                  </li>
                )
              )}
            </ul>
          )}

        </section>


        {/* DOSE HISTORY */}

        <section className="section">

          <h2>💉 Recent Dose History</h2>

          {analytics.recent_doses.length === 0 ? (
            <p>No dose records found.</p>
          ) : (
            <ul>
              {analytics.recent_doses.map(
                (dose) => (
                  <li key={dose.id}>
                    {dose.name} -{" "}
                    {dose.taken_at}
                  </li>
                )
              )}
            </ul>
          )}

        </section>


        {/* HEALTH METRICS */}

        <section className="section">

          <h2>📈 Recent Health Metrics</h2>

          {analytics.recent_metrics.length === 0 ? (
            <p>No health metrics found.</p>
          ) : (
            <ul>
              {analytics.recent_metrics.map(
                (metric) => (
                  <li key={metric.id}>
                    <strong>
                      {metric.metric_type}
                    </strong>
                    : {metric.value}{" "}
                    {metric.unit || ""}{" "}
                    ({metric.recorded_at})
                  </li>
                )
              )}
            </ul>
          )}

        </section>


        {/* API STATUS */}

        <div className="status">

          <strong>API Status: </strong>

          <span>
            {apiStatus}
          </span>

        </div>


        <button
          className="refresh"
          onClick={loadHealthData}
        >
          🔄 Refresh Health Data
        </button>

      </main>

    </div>
  );
}

export default App;