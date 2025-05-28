import API_BASE from './config';

export async function refreshTokenIfNeeded() {
  const access = getCookie('access');
  if (access) return access;

  const refresh = getCookie('refresh');
  if (!refresh) return null;

  try {
    const response = await fetch(`${API_BASE}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (!response.ok) return null;

    const data = await response.json();
    document.cookie = `access=${data.access}; path=/`;
    return data.access;
  } catch {
    return null;
  }
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(name + '='));
  return cookie ? cookie.split('=')[1] : null;
}
