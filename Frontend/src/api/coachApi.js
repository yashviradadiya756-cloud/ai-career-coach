import api from "./axios";


export const askCoach = (question) => {
  api.post("/api/coach/ask", {
  message: input
});
};


export const getCoachHistory = () => {
  return api.get("/api/coach/history");
};


export const getCoachDashboard = () => {
  return api.get("/api/coach/dashboard");
};

const handleSend = async () => {
  if (!input.trim()) return;

  try {
    const response = await api.post("/api/coach/ask", {
      message: input,
    });

    console.log("AI RESPONSE:", response.data);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: input,
      },
      {
        role: "assistant",
        text: response.data.answer,
      },
    ]);

    setInput("");
  } catch (error) {
    console.error("AI Coach Error:", error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text:
          error.response?.data?.message ||
          "AI Coach failed. Please try again.",
      },
    ]);
  }
};