// Router and event handling. Pages live in pages.js, data in data.js, server calls in api.js.
const app = document.getElementById('app');

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'show';
  setTimeout(() => (t.className = ''), 2400);
}

function render() {
  const [page = '', id] = location.hash.replace('#/', '').split('/');
  app.innerHTML = (Pages[page] || Pages[''])(id);
  document.querySelectorAll('#nav a').forEach(a =>
    a.classList.toggle('on', a.dataset.p === (page === 'alumni' ? 'directory' : page)));
  window.scrollTo(0, 0);
  if (page === 'directory') initDirectory();
}

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const id = Number(b.dataset.id), act = b.dataset.act;
  const p = pending.find(x => x.pid === id);
  try {
    if (act === 'approve') {
      await mutate(() => {
        if (p.aid) Object.assign(byId(p.aid), p.changes); else alumni.push({ id: alumni.length + 1, ...p.changes });
        pending = pending.filter(x => x.pid !== id);
      }, 'POST', `/api/pending/${id}/approve`);
      toast(`Approved ${p.name}`);
    }
    if (act === 'reject') { await mutate(() => { pending = pending.filter(x => x.pid !== id); }, 'DELETE', `/api/pending/${id}`); toast('Submission rejected'); }
    if (act === 'removeTalk') { await mutate(() => talks.splice(talks.findIndex(t => t.id === id), 1), 'DELETE', `/api/talks/${id}`); toast('Talk removed'); }
  } catch { toast('Something went wrong. Check that the server is running.'); }
  render();
});

document.addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  if (f.id === 'heroSearch') { presetQuery = f.q.value; location.hash = '#/directory'; }
  if (f.id === 'connectForm') { f.reset(); toast(`Request sent to ${f.dataset.name}'s admin contact`); }
  if (f.id === 'profileForm') {
    const body = { aid: 1, name: byId(1).name, changes: { role: f.role.value, company: f.company.value, bio: f.bio.value, mentor: f.mentor.checked } };
    try { await mutate(() => pending.push({ pid: Date.now(), ...body }), 'POST', '/api/pending', body); toast('Submitted for approval'); }
    catch { toast('Could not submit. Check that the server is running.'); }
    render();
  }
});

window.addEventListener('hashchange', render);
loadData().then(() => {
  document.querySelector('footer').append(online ? ' · Connected to database' : ' · Demo mode (no server running)');
  render();
});
