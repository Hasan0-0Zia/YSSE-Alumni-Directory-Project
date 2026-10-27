# YSSE Alumni Directory (demo)

Plain HTML, CSS and JavaScript frontend with a small Node.js + SQLite backend.

## Run with the database
1. Install Node.js 20 or newer.
2. In this folder run `npm install`, then `npm start`.
3. Open http://localhost:3000. The footer says "Connected to database".

The database file `server/alumni.db` is created and filled with sample data on first run. Delete it to reset.

## Run without the server
Open `index.html` directly. The footer says "Demo mode" and the site uses the sample data in `js/data.js`. Changes reset on refresh.

## Files
- `js/data.js`    sample data (also the database seed)
- `js/pages.js`   one function per page
- `js/api.js`     loads data from the server and sends changes
- `js/app.js`     hash router and click/submit handlers
- `server/db.js`  tables, seeding, field whitelist
- `server/server.js` Express routes under `/api`
- `css/styles.css` colors and fonts are CSS variables at the top

## Not built yet
Login and roles. Right now anyone can call the admin endpoints (approve, reject, remove talk). Add authentication before real use. Also missing: image upload and real messaging for connection requests.
