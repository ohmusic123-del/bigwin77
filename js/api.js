const API = "https://YOUR-BACKEND.onrender.com";

function apiPost(url, data, token) {
  return fetch(API + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: token })
    },
    body: JSON.stringify(data)
  }).then(r => r.json());
}

function apiGet(url, token) {
  return fetch(API + url, {
    headers: { Authorization: token }
  }).then(r => r.json());
}
