import axios from "axios";

// =====================================================
// CONTACT API
// =====================================================

// IMPORTANT:
// Backend route is:
// POST https://ai-career-coach-jpzu.onrender.com/api/contact

const CONTACT_API_URL =
  "https://ai-career-coach-jpzu.onrender.com/api/contact";


// =====================================================
// SEND CONTACT MESSAGE
// =====================================================

export const sendContactMessage = async (data) => {
  console.log("=================================");
  console.log("CONTACT API REQUEST");
  console.log("URL:", CONTACT_API_URL);
  console.log("DATA:", data);
  console.log("=================================");

  const response = await axios.post(
    CONTACT_API_URL,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};