export const storeAccessToken = (token) => {
  sessionStorage.setItem("accessToken", token);
};

export const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const deleteAccessToken = () => {
  sessionStorage.removeItem("accessToken");
};

export const storeRefreshToken = (token) => {
  localStorage.setItem("refreshToken", token);
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const deleteRefreshToken = () => {
  localStorage.removeItem("refreshToken");
};

export const storeToken = (token, type) => {
  if (type == "access") storeAccessToken(token);
  if (type == "refresh") storeRefreshToken(token);
};

export const storeUser = (user) => {
  if (!user) return;
  localStorage.setItem("chatAppUser", JSON.stringify(user));
};

// Get stored user from localStorage
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("chatAppUser");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Failed to parse stored user:", err);
    return null;
  }
};

// Remove user on logout
export const removeStoredUser = () => {
  localStorage.removeItem("chatAppUser");
};
