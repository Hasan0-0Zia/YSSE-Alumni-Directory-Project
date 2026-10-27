/* ==========================================================================
   Helper & Utility Functions
   ========================================================================== */
// Each page is a function that returns an HTML string. app.js puts it on screen.
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const byId = id => alumni.find(a => a.id == id);
const fmt = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
- const avatar = (a, big) => `<div class="avatar${big ? ' big' : ''}" style="--h:${a.id
47 % 360}">${esc(a.name.split(' ').map(w => w[0]).slice(0, 2).join(''))}</div>`;

const card = a => `<a class="alum" href="#/alumni/${a.id}">${avatar(a)}<div>
  <h3>${esc(a.name)}</h3><p>${esc(a.role)}, ${esc(a.company)}</p>
  <p class="tags"><span>Batch ${a.batch}</span><span>${esc(a.dept)}</span>${a.mentor ? '<span class="open">Open to mentoring</span>' : ''}</p></div></a>`;

/* ==========================================================================
   State Management
   ========================================================================== */
let presetQuery = ''; // lets the homepage search pass a query to the directory

/* ==========================================================================
   Page Templates
   ========================================================================== */
const Pages = {
  '': () => `
    <section class="hero"><div class="wrap">
      <h1>Find the YSSE alumni who walked your path first.</h1>
      <p>Search ${alumni.length} alumni by name, company or role, read how their careers unfolded, and ask them for advice.</p>
      <form id="heroSearch"><input name="q" type="search" placeholder="Try &quot;BRAC&quot; or &quot;founder&quot;" aria-label="Search alumni"><button class="btn sun">Search alumni</button></form>
    </div></section>
    <section class="wrap"><h2>Featured alumni</h2>
      <div class="grid">${[1, 8, 5].map(id => card(byId(id))).join('')}</div>
      <div class="links"><a class="btn ghost" href="#/directory">Browse the full directory</a>
      <a class="btn ghost" href="#/talks">See Alumni Talk sessions</a>
      <a class="btn ghost" href="#/achievements">Read success stories</a></div></section>`,

  directory: () => `<section class="wrap"><h1>Alumni directory</h1>
    <div class="filters">
      <input id="q" type="search" placeholder="Search name, company, role or batch" aria-label="Search alumni">
      <select id="dept" aria-label="Department"><option value="">All departments</option>${DEPTS.map(d => `<option>${esc(d)}</option>`).join('')}</select>
      <select id="batch" aria-label="Batch"><option value="">All batches</option>${[...new Set(alumni.map(a => a.batch))].sort().map(b => `<option>${b}</option>`).join('')}</select>
      <label class="chk"><input id="mentor" type="checkbox"> Open to mentoring</label>
    </div><p id="count" class="muted"></p><div id="grid" class="grid"></div></section>`,

  alumni: id => {
    const a = byId(id);
    if (!a) return '<section class="wrap"><p class="empty">We could not find this alumnus. <a href="#/directory">Back to the directory</a></p></section>';
    return `<section class="wrap"><a href="#/directory" class="back">Back to directory</a>
      <div class="phead">${avatar(a, true)}<div><h1>${esc(a.name)}</h1>
        <p>${esc(a.role)} at ${esc(a.company)}, ${esc(a.city)}</p>
        <p class="tags"><span>Batch ${a.batch}</span><span>${esc(a.dept)}</span></p></div></div>
      <p class="lead">${esc(a.bio)}</p>
      <div class="cols"><div>
        <h2>Professional journey</h2><ol class="timeline">${a.journey.map(([y, t]) => `<li><b>${y}</b> ${esc(t)}</li>`).join('')}</ol>
        <h2>Achievements</h2><ul>${a.achievements.map(x => `<li>${esc(x)}</li>`).join('') || '<li class="muted">No achievements added yet.</li>'}</ul>
      </div><aside class="panel"><h2>Connect</h2>
        ${a.linkedin ? `<p><a href="${esc(a.linkedin)}">LinkedIn profile</a></p>` : '<p class="muted">This alumnus keeps contact details private.</p>'}
        <form id="connectForm" data-name="${esc(a.name)}"><label>Your message
          <textarea required rows="4" placeholder="Say who you are and what you would like to learn."></textarea></label>
          <button class="btn">Send connection request</button></form>
        <p class="muted small">Requests go through the admin team, so contact details stay private.</p>
      </aside></div></section>`;
  },

  talks: () => {
    const row = t => { const s = byId(t.speaker); return `<li class="talk"><div class="date">${fmt(t.date)}</div>
      <div><h3>${esc(t.title)}</h3><p>by <a href="#/alumni/${s.id}">${esc(s.name)}</a>, ${esc(s.company)}</p></div>
      <a class="btn ghost" href="#">${t.upcoming ? 'Join live session' : 'Watch recording'}</a></li>`; };
    return `<section class="wrap"><h1>Alumni Talk</h1><p class="lead">Sessions where alumni share what they learned along the way.</p>
      <h2>Upcoming</h2><ul class="talks">${talks.filter(t => t.upcoming).map(row).join('')}</ul>
      <h2>Past sessions</h2><ul class="talks">${talks.filter(t => !t.upcoming).map(row).join('')}</ul>
      <h2>Alumni open to sharing their experience</h2><div class="grid">${alumni.filter(a => a.mentor).map(card).join('')}</div></section>`;
  },

  achievements: () => `<section class="wrap"><h1>Alumni achievements</h1><p class="lead">Awards, research and ventures from the YSSE community.</p>
    <div class="grid">${achievements.map(x => { const a = byId(x.alum); return `<article class="panel"><p class="tags"><span>${esc(x.type)}</span><span>${x.year}</span></p>
      <h3>${esc(x.title)}</h3><p>${esc(x.text)}</p><a href="#/alumni/${a.id}">${esc(a.name)}'s profile</a></article>`; }).join('')}</div></section>`,

  dashboard: () => { const a = byId(1); return `<section class="wrap narrow"><h1>My profile</h1>
    <p class="lead">Demo: signed in as ${esc(a.name)}. Changes appear in the directory after an admin approves them.</p>
    <form id="profileForm" class="panel form">
      <label>Current role<input name="role" value="${esc(a.role)}" required></label>
      <label>Workplace<input name="company" value="${esc(a.company)}" required></label>
      <label>Short bio<textarea name="bio" rows="3">${esc(a.bio)}</textarea></label>
      <label class="chk"><input type="checkbox" name="mentor" ${a.mentor ? 'checked' : ''}> I am open to mentoring and giving talks</label>
      <button class="btn">Submit for approval</button></form>
    <p class="muted">Your submissions awaiting review: ${pending.filter(p => p.aid == 1).length}</p></section>`; },

  admin: () => `<section class="wrap"><h1>Admin dashboard</h1>
    <div class="stats"><div><b>${alumni.length}</b> alumni</div><div><b>${pending.length}</b> to review</div><div><b>${talks.length}</b> talks</div><div><b>${achievements.length}</b> achievements</div></div>
    <h2>Profiles to review</h2>
    ${pending.length ? `<div class="tw"><table><thead><tr><th>Name</th><th>Change</th><th></th></tr></thead><tbody>${pending.map(p => `<tr><td>${esc(p.name)}</td>
      <td>${p.aid ? 'Update: ' + esc(Object.keys(p.changes).join(', ')) : 'New member'}</td>
      <td class="act"><button class="btn small" data-act="approve" data-id="${p.pid}">Approve</button> <button class="btn small ghost" data-act="reject" data-id="${p.pid}">Reject</button></td></tr>`).join('')}</tbody></table></div>`
      : '<p class="empty">Nothing to review. New submissions will appear here.</p>'}
    <h2>Alumni Talk entries</h2>
    <div class="tw"><table><thead><tr><th>Title</th><th>Date</th><th></th></tr></thead><tbody>${talks.map(t => `<tr><td>${esc(t.title)}</td><td>${fmt(t.date)}</td>
      <td class="act"><button class="btn small ghost" data-act="removeTalk" data-id="${t.id}">Remove</button></td></tr>`).join('')}</tbody></table></div></section>`
};

/* ==========================================================================
   Initialization & Event Handlers
   ========================================================================== */
// Directory filtering runs in the browser every time a filter changes.
function initDirectory() {
  const $ = id => document.getElementById(id);
  $('q').value = presetQuery; presetQuery = '';
  const run = () => {
    const q = $('q').value.trim().toLowerCase();
    const list = alumni.filter(a =>
      (!q || [a.name, a.company, a.role, a.batch].join(' ').toLowerCase().includes(q)) &&
      (!$('dept').value || a.dept === $('dept').value) &&
      (!$('batch').value || a.batch == $('batch').value) &&
      (!$('mentor').checked || a.mentor));
    $('count').textContent = `${list.length} alumni found`;
    $('grid').innerHTML = list.map(card).join('') || '<p class="empty">No alumni match these filters. Clear a filter or try a different search.</p>';
  };
  document.querySelectorAll('.filters input, .filters select').forEach(el => el.addEventListener('input', run));
  run();
}