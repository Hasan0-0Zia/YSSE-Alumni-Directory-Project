// Express API + static file server. Run with: npm start
const express = require('express');
const path = require('path');
const { db, FIELDS, toVal, fromRow } = require('./db');

const root = path.join(__dirname, '..');
const app = express();
app.use(express.json({ limit: '50kb' }));
app.use('/css', express.static(path.join(root, 'css')));
app.use('/js', express.static(path.join(root, 'js')));
app.get('/', (req, res) => res.sendFile(path.join(root, 'index.html')));

const clean = c => Object.fromEntries(Object.entries(c || {}).filter(([k]) => FIELDS.includes(k)));

app.get('/api/data', (req, res) => res.json({
  alumni: db.prepare('SELECT * FROM alumni ORDER BY id').all().map(fromRow),
  talks: db.prepare('SELECT * FROM talks ORDER BY date').all().map(t => ({ ...t, upcoming: !!t.upcoming })),
  achievements: db.prepare('SELECT alum,type,year,title,text FROM achievements ORDER BY year DESC').all(),
  pending: db.prepare('SELECT * FROM pending ORDER BY pid').all().map(p => ({ ...p, changes: JSON.parse(p.changes) }))
}));

// An alumnus submits a new profile or an update. It waits for admin approval.
app.post('/api/pending', (req, res) => {
  const { aid = null, name, changes } = req.body;
  if (!name || typeof name !== 'string') return res.status(400).json({ error: 'name is required' });
  db.prepare('INSERT INTO pending(aid,name,changes) VALUES(?,?,?)').run(aid, name, JSON.stringify(clean(changes)));
  res.status(201).json({ ok: true });
});

app.post('/api/pending/:id/approve', (req, res) => {
  const p = db.prepare('SELECT * FROM pending WHERE pid=?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'not found' });
  const c = clean(JSON.parse(p.changes)), keys = Object.keys(c);
  if (!p.aid && !c.name) return res.status(400).json({ error: 'new members need a name' });
  db.transaction(() => {
    if (p.aid && keys.length) db.prepare(`UPDATE alumni SET ${keys.map(k => k + '=?')} WHERE id=?`).run(...keys.map(k => toVal(k, c[k])), p.aid);
    if (!p.aid) db.prepare(`INSERT INTO alumni(${keys}) VALUES(${keys.map(() => '?')})`).run(...keys.map(k => toVal(k, c[k])));
    db.prepare('DELETE FROM pending WHERE pid=?').run(p.pid);
  })();
  res.json({ ok: true });
});

app.delete('/api/pending/:id', (req, res) => { db.prepare('DELETE FROM pending WHERE pid=?').run(req.params.id); res.json({ ok: true }); });
app.delete('/api/talks/:id', (req, res) => { db.prepare('DELETE FROM talks WHERE id=?').run(req.params.id); res.json({ ok: true }); });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`YSSE Alumni Directory running at http://localhost:${port}`));
