export const loginRequest = (username: string, password: string) => {
  return fetch("http://localhost:9000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.body)
    .catch((error) => error.message);
};
