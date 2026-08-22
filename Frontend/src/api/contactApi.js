import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


// =====================================================
// SEND CONTACT MESSAGE
// =====================================================

export const sendContactMessage = async (data) => {
  const response = await axios.post(
    `${API_URL}/contact`,
    data
  );

  return response.data;
};


// =====================================================
// ADMIN - GET CONTACT MESSAGES
// =====================================================

export const getContactMessages = async (token) => {
  const response = await axios.get(
    `${API_URL}/contact`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// ADMIN - UPDATE STATUS
// =====================================================

export const updateContactStatus = async (
  id,
  status,
  token
) => {
  const response = await axios.patch(
    `${API_URL}/contact/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// ADMIN - DELETE MESSAGE
// =====================================================

export const deleteContactMessage = async (
  id,
  token
) => {
  const response = await axios.delete(
    `${API_URL}/contact/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};