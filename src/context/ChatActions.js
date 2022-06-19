const API_URL = 'http://localhost:5000';
const jsonHeaders = {
  'Content-Type': 'application/json',
};
const paramsHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
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
    headers: paramsHeaders,
  });

  return response;
};

export const getUserMessages = async userId => {
  const response = await fetch(`${API_URL}/messages/${userId}`, {
    headers: paramsHeaders,
  });

  return response;
};

export const createNewMessage = async (userId, contactId, content) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      senderId: userId,
      receiverId: contactId,
      content,
    }),
  });

  return response;
};

export const deleteMessage = async (userId, messageId) => {
  try {
    const response = await fetch(`${API_URL}/messages/delete`, {
      method: 'DELETE',
      headers: jsonHeaders,
      body: JSON.stringify({
        userId,
        messageId,
      }),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMultipleMessages = async (userId, messageIdsString) => {
  const response = await fetch(`${API_URL}/messages/delete/multiple`, {
    method: 'DELETE',
    headers: jsonHeaders,
    body: JSON.stringify({
      userId,
      messageIdsString,
    }),
  });

  return response;
};

export const getUserMostRecentMessagesFromContacts = async userId => {
  const response = await fetch(`${API_URL}/messages/${userId}`, {
    method: 'POST',
    headers: paramsHeaders,
  });

  return response;
};
