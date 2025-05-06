const http = require('k6/http');
const { sleep, check } = require('k6');

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '20s', target: 20 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],
  },
};

function getAuthToken() {
  const loginResp = http.post(
    'http://localhost:3030/api/auth/login',
    JSON.stringify({
      email: 'vincent@zelabstudio.com',
      password: 'Test1234',
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log(`Login response: ${loginResp.status}`);
  if (loginResp.status == 200) {
    return JSON.parse(loginResp.body).token;
  }

  return null;
}

export function setup() {
  const token = getAuthToken();
  if (!token) {
    console.error('Failed to get auth token');
    return null;
  }
  return { token };
}

export default function (data) {
  // Procède à l'appel sur la route
  const response = http.get('http://localhost:3030/api/feedback', {
    headers: {
      Authorization: `Bearer ${data.token}`,
      contentType: 'application/json',
    },
  });
  // Vérifie le statut de la réponse
  // Vérifie le temps de réponse
  check(response, {
    'is status 200': r => r.status === 200,
    'response time OK': r => r.timings.duration < 200,
  });
  // Pause entre chaque appel / itération
  sleep(1);
}
