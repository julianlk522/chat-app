const API_URL = 'http://localhost:5000';
const jsonHeaders = {
  'Content-Type': 'application/json',
};
const paramsHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

export const createNewUser = async signupData => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(signupData),
  });

  return await response.json();
};

export const loginUser = async loginData => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(loginData),
  });

  return await response.json();
};

export const getAllContacts = async () => {
  const response = await fetch(`${API_URL}/users`);
  return await response.json();
};

export const getSortedUserContacts = async userId => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: paramsHeaders,
  });

  return await response.json();
};

export const getUserNicknames = async userId => {
  const response = await fetch(`${API_URL}/users/${userId}/nicknames`, {
    headers: paramsHeaders,
  });

  return await response.json();
};

export const getUserMessages = async userId => {
  const response = await fetch(`${API_URL}/messages/${userId}`, {
    headers: paramsHeaders,
  });

  return await response.json();
};

export const readContactMessages = async (userId, contactId) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify({ userId, contactId }),
  });

  return await response.json();
};

export const assignNewNickname = async nickNameData => {
  const response = await fetch(`${API_URL}/users/new-nickname`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(nickNameData),
  });

  return await response.json();
};

export const assignNewPreferedPic = async (userId, preferedPic) => {
  const response = await fetch(
    `${API_URL}/users/${userId}/prefered-pic/${preferedPic}`,
    {
      method: 'POST',
      headers: paramsHeaders,
    }
  );

  return await response.json();
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

  return await response.json();
};

export const deleteMessage = async (userId, messageId) => {
  const response = await fetch(`${API_URL}/messages/delete`, {
    method: 'DELETE',
    headers: jsonHeaders,
    body: JSON.stringify({
      userId,
      messageId,
    }),
  });
  return await response.json();
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

  return await response.json();
};
