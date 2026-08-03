import api from "./axios";

export const askCoach = (question) => {
  return api.post("/api/coach/ask", {
    message: question,
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

  const userMessage = input.trim();

  try {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");

    const response = await askCoach(userMessage);

    console.log("AI RESPONSE:", response.data);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: response.data.answer,
      },
    ]);
  } catch (error) {
    console.error("AI Coach Error:", error);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text:
          error.response?.data?.message ||
          "AI Coach is temporarily unavailable.",
      },
    ]);
  }
};