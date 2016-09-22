const GITHUB_HOST = 'https://api.github.com';
const GITHUB_ACCEPT_HEADER = 'application/vnd.github.v3+json';

export function fetchGithub(url, {accessToken, headers, ...init} = {}) {
  return fetch(new URL(url, GITHUB_HOST), {
    method: 'GET',
    ...init,
    headers: {
      ...headers,
      'Accept': GITHUB_ACCEPT_HEADER,
      'Authorization': `token ${accessToken}`,
    },
  });
}
