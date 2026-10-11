import { useEffect, useState } from "react";
import "./App.css";

const API = "https://health-monitoring-assistant.onrender.com";

function App() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState(null);
  const [medications, setMedications] = useState([]);
  const [doseHistory, setDoseHistory] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [apiStatus, setApiStatus] = useState("Checking...");

  // Check API connection
  const checkAPI = async () => {
    try {
      const response = await fetch(`${API}/health`);

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();

      if (data.status === "healthy") {
        setApiStatus("Connected");
      } else {
        setApiStatus("Error");
      }
    } catch (error) {
      console.error("API connection error:", error);
      setApiStatus("Connection failed");
    }
  };

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      const [
        summaryResponse,
        analyticsResponse,
        insightsResponse,
        medicationsResponse,
        doseResponse,
        metricsResponse
      ] = await Promise.all([
        fetch(`${API}/health/summary`),
        fetch(`${API}/analytics`),
        fetch(`${API}/insights`),
        fetch(`${API}/medications`),
        fetch(`${API}/dose-history`),
        fetch(`${API}/health-metrics`)
      ]);

      if (summaryResponse.ok) {
        setSummary(await summaryResponse.json());
      }

      if (analyticsResponse.ok) {
        setAnalytics(await analyticsResponse.json());
      }

      if (insightsResponse.ok) {
        setInsights(await insightsResponse.json());
      }

      if (medicationsResponse.ok) {
        setMedications(await medicationsResponse.json());
      }

      if (doseResponse.ok) {
        setDoseHistory(await doseResponse.json());
      }

      if (metricsResponse.ok) {
        setMetrics(await metricsResponse.json());
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  // Ask AI
  const askAI = async () => {
    if (!question.trim()) {
      return;
    }

    setLoadingAI(true);
    setAnswer("");

    try {
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: question
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error("AI error:", error);
      setAnswer(
        "Unable to connect to health assistant AI. Please check your internet connection and try again."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  // Voice input
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setQuestion(text);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
    };

    recognition.start();
  };

  // Load everything when page opens
  useEffect(() => {
    checkAPI();
    loadDashboard();
  }, []);

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>Smart Health Assistant</h1>
          <p>AI-powered health monitoring dashboard</p>
        </div>

        <div className="api-status">
          <span
            className={
              apiStatus === "Connected"
                ? "status-dot connected"
                : "status-dot"
            }
          ></span>

          API Status: {apiStatus}
        </div>
      </header>

      {/* Main */}
      <main className="container">

        {/* Analytics */}
        <section>
          <h2>Health Overview</h2>

          <div className="cards">

            <div className="card">
              <h3>Active Medications</h3>
              <p className="number">
                {summary?.active_medications ?? 0}
              </p>
            </div>

            <div className="card">
              <h3>Doses Recorded</h3>
              <p className="number">
                {summary?.dose_records ?? 0}
              </p>
            </div>

            <div className="card">
              <h3>Health Metrics</h3>
              <p className="number">
                {summary?.health_metric_records ?? 0}
              </p>
            </div>

            <div className="card">
              <h3>Total Records</h3>
              <p className="number">
                {analytics
                  ? analytics.total_doses_recorded +
                    analytics.total_health_metrics
                  : 0}
              </p>
            </div>

          </div>
        </section>

        {/* AI Chat */}
        <section className="panel">
          <h2>AI Health Assistant</h2>

          <p className="description">
            Ask the health assistant about your stored health information,
            medications, or health-related questions.
          </p>

          <div className="chat-box">

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something like: What medications do I have?"
              rows="4"
            />

            <div className="button-row">

              <button onClick={startVoice}>
                🎤 Voice
              </button>

              <button
                onClick={askAI}
                disabled={loadingAI}
              >
                {loadingAI ? "Thinking..." : "Ask AI"}
              </button>

            </div>

          </div>

          {answer && (
            <div className="answer">
              <h3>AI Response</h3>
              <p>{answer}</p>
            </div>
          )}
        </section>

        {/* Insights */}
        <section className="panel">
          <h2>Health Insights</h2>

          {insights?.insights?.length > 0 ? (
            <ul>
              {insights.insights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No insights available.</p>
          )}
        </section>

        {/* Medications */}
        <section className="panel">
          <h2>Current Medications</h2>

          {medications.length === 0 ? (
            <p>No active medications recorded.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Dosage</th>
                    <th>Time</th>
                  </tr>
                </thead>

                <tbody>
                  {medications.map((medicine) => (
                    <tr key={medicine.id}>
                      <td>{medicine.name}</td>
                      <td>{medicine.dosage || "-"}</td>
                      <td>{medicine.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Dose History */}
        <section className="panel">
          <h2>Recent Dose History</h2>

          {doseHistory.length === 0 ? (
            <p>No dose records available.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Dosage</th>
                    <th>Taken At</th>
                  </tr>
                </thead>

                <tbody>
                  {doseHistory.slice(0, 10).map((dose) => (
                    <tr key={dose.id}>
                      <td>{dose.name}</td>
                      <td>{dose.dosage || "-"}</td>
                      <td>{dose.taken_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Health Metrics */}
        <section className="panel">
          <h2>Recent Health Metrics</h2>

          {metrics.length === 0 ? (
            <p>No health metrics recorded.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Recorded At</th>
                  </tr>
                </thead>

                <tbody>
                  {metrics.slice(0, 10).map((metric) => (
                    <tr key={metric.id}>
                      <td>{metric.metric_type}</td>
                      <td>{metric.value}</td>
                      <td>{metric.unit || "-"}</td>
                      <td>{metric.recorded_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Refresh */}
        <div className="refresh-section">
          <button
            onClick={() => {
              checkAPI();
              loadDashboard();
            }}
          >
            🔄 Refresh Dashboard
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer>
        <p>
          Smart Health Assistant — Track B Advanced Health-Tech Project
        </p>
      </footer>

    </div>
  );
}

export default App;