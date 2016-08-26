const GITHUB_HOST = 'https://api.github.com';
const GITHUB_ACCEPT_HEADER = 'application/vnd.github.v3+json';

function fetchGithub(url, {accessToken, headers, ...init} = {}) {
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

export async function getOrgMembers({accessToken}) {
  let orgMembersRes = await fetchGithub('/orgs/tc39/members', {accessToken});
  return orgMembersRes.json();
}

export async function getAgendas({accessToken}) {
  let repoContentsRes = await fetchGithub('/repos/tc39/agendas/contents/', {accessToken});
  let repoContents = await repoContentsRes.json();

  let yearsDirs = repoContents.filter(({name, type}) => {
    return type === 'dir' && /\d{4}/.test(name);
  });

  let yearsContents = await Promise.all(
    yearsDirs.map(async (dir) => {
      let dirContentsRes = await fetchGithub(dir.url, {accessToken});
      return dirContentsRes.json();
    })
  );

  return yearsContents.reduce((agendas, yearContents) => {
    return agendas.concat(
      yearContents.filter(({name, type}) => {
        return type === 'file' && /\d{2}\.md/.test(name);
      })
    );
  }, []);
}

export async function getAgendaContents(agenda, {accessToken}) {
  let agendaContentsRes = await fetchGithub(agenda.url, {accessToken});
  return agendaContentsRes.json();
}
