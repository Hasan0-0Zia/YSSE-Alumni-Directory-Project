// Talks to the server. If the server is not running, the site keeps working with the sample data in data.js.
let online = false;

async function loadData() {
  try {
    const d = await (await fetch('/api/data')).json();
    alumni.splice(0, alumni.length, ...d.alumni);
    talks.splice(0, talks.length, ...d.talks);
    achievements.splice(0, achievements.length, ...d.achievements);
    pending = d.pending;
    online = true;
  } catch { online = false; }
}

// Online: send the change to the server, then reload. Offline: run the local fallback instead.
async function mutate(local, method, url, body) {
  if (!online) return local();
  const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  if (!r.ok) throw new Error('Request failed');
  await loadData();
}
