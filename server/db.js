// SQLite database: creates tables and seeds them from js/data.js on first run.
const Database = require('better-sqlite3');
const path = require('path');
const seed = require('../js/data.js');

const db = new Database(path.join(__dirname, 'alumni.db'));
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS alumni(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, batch INTEGER, dept TEXT, role TEXT,
  company TEXT, city TEXT, mentor INTEGER DEFAULT 0, linkedin TEXT DEFAULT '', bio TEXT DEFAULT '', journey TEXT DEFAULT '[]', achievements TEXT DEFAULT '[]');
CREATE TABLE IF NOT EXISTS talks(id INTEGER PRIMARY KEY AUTOINCREMENT, speaker INTEGER REFERENCES alumni(id), title TEXT NOT NULL, date TEXT, upcoming INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS achievements(id INTEGER PRIMARY KEY AUTOINCREMENT, alum INTEGER REFERENCES alumni(id), type TEXT, year INTEGER, title TEXT, text TEXT);
CREATE TABLE IF NOT EXISTS pending(pid INTEGER PRIMARY KEY AUTOINCREMENT, aid INTEGER, name TEXT, changes TEXT);`);

// Only these alumni fields can be written. Column names never come straight from the user.
const FIELDS = ['name', 'batch', 'dept', 'role', 'company', 'city', 'mentor', 'linkedin', 'bio', 'journey', 'achievements'];
const toVal = (k, v) => k === 'mentor' ? (v ? 1 : 0) : (k === 'journey' || k === 'achievements') ? JSON.stringify(v) : v;
const fromRow = r => ({ ...r, mentor: !!r.mentor, journey: JSON.parse(r.journey), achievements: JSON.parse(r.achievements) });

if (db.prepare('SELECT COUNT(*) n FROM alumni').get().n === 0) {
  db.transaction(() => {
    for (const a of seed.alumni) db.prepare(`INSERT INTO alumni(id,${FIELDS}) VALUES(?${',?'.repeat(FIELDS.length)})`).run(a.id, ...FIELDS.map(k => toVal(k, a[k])));
    for (const t of seed.talks) db.prepare('INSERT INTO talks(id,speaker,title,date,upcoming) VALUES(?,?,?,?,?)').run(t.id, t.speaker, t.title, t.date, t.upcoming ? 1 : 0);
    for (const x of seed.achievements) db.prepare('INSERT INTO achievements(alum,type,year,title,text) VALUES(?,?,?,?,?)').run(x.alum, x.type, x.year, x.title, x.text);
    for (const p of seed.pending) db.prepare('INSERT INTO pending(aid,name,changes) VALUES(?,?,?)').run(p.aid, p.name, JSON.stringify(p.changes));
  })();
}
module.exports = { db, FIELDS, toVal, fromRow };
