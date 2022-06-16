const API_URL = 'http://localhost:5000';
const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const loginUser = async loginData => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(loginData),
  });

  return response;
};

export const getUserContacts = async userId => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: jsonHeaders,
  });

  return response;
};

export const getUserMessages = async userId => {
  const response = await fetch(`${API_URL}/messages/${userId}`, {
    headers: jsonHeaders,
  });

  return response;
};

export const getUserMostRecentMessagesFromContacts = async userId => {
  const response = await fetch(`${API_URL}/messages/${userId}`, {
    method: 'POST',
    headers: jsonHeaders,
  });

  return response;
};
