from langchain.tools import tool
from langchain.agents import create_agent
from langchain_ollama import ChatOllama

from backend.tools.health_tools import (
    health_summary_tool,
    dose_history_tool,
    health_metrics_tool
)

from backend.tools.medicine_tools import medication_tool

from backend.tools.health_info_tools import (
    health_information_tool,
    weather_tool,
    air_quality_tool
)


# ---------------- HEALTH TOOLS ----------------

@tool
def get_health_summary():
    """Get a summary of the patient's stored health data."""
    return health_summary_tool()


@tool
def get_medications():
    """Get the patient's active medications."""
    return medication_tool()


@tool
def get_dose_history():
    """Get the patient's medication dose history."""
    return dose_history_tool()


@tool
def get_health_metrics():
    """Get the patient's recorded health metrics."""
    return health_metrics_tool()


# ---------------- ALL TOOLS ----------------

tools = [
    get_health_summary,
    get_medications,
    get_dose_history,
    get_health_metrics,
    health_information_tool,
    weather_tool,
    air_quality_tool
]


# ---------------- QWEN3 MODEL ----------------

model = ChatOllama(
    model="qwen3:1.7b",
    temperature=0
)


# ---------------- HEALTH AGENT ----------------

agent = create_agent(
    model=model,
    tools=tools,
    system_prompt="""
You are a Smart Health Assistant.

Help users understand their stored health information,
medications, health metrics, weather, air quality, and general
health information.

Use the available tools when appropriate.

Never invent patient data.

Do not diagnose medical conditions.

For serious or urgent concerns, recommend speaking with a qualified
healthcare professional.

Answer in simple, clear language.
"""
)


# ---------------- ASK ASSISTANT ----------------

def ask_health_assistant(question: str):
    """Send a question to the LangChain health assistant."""

    result = agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": question
                }
            ]
        }
    )

    return result["messages"][-1].content