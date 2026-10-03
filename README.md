# ES Kabirizi — Backend (Node.js MVC + XAMPP MySQL)

This project is the backend for the ES Kabirizi school website. It uses:
- **XAMPP** → just for the **MySQL** database (and phpMyAdmin to manage it)
- **Node.js + Express** → the actual web server, built in MVC style:
  - `models/` → database queries
  - `controllers/` → business logic
  - `routes/` → API endpoints
  - `middleware/` → auth/role checks
  - `public/` → the frontend pages (login, dashboard, admin)

## 1. Start XAMPP

1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache** and **MySQL**. Both should turn green.
   (Apache isn't strictly required since Node serves the pages, but phpMyAdmin needs it.)

## 2. Create the database

1. Go to `http://localhost/phpmyadmin` in your browser.
2. Click the **SQL** tab.
3. Open `database/schema.sql` from this project, copy its contents, paste into the SQL box, and click **Go**.
   This creates the `eskabirizi_db` database and the `users` table.

## 3. Install Node.js dependencies

In this project folder, run:

```bash
npm install
```

## 4. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The defaults match a standard XAMPP MySQL install (`root` user, no password). Only change `.env` if your XAMPP MySQL uses a different username/password.

## 5. Seed the 5 user accounts

This creates 1 admin, 2 teachers, and 2 parents with properly hashed passwords:

```bash
npm run seed
```

You'll see output confirming each account. **Login credentials:**

| Role    | Login (username or email)   | Password      |
|---------|------------------------------|----------------|
| Admin (Principal) | `admin`            | `school2026`   |
| Teacher | teacher1@eskabirizi.rw       | Teacher@123    |

⚠️ Change these passwords before using this in production. The admin account matches the credentials already used on the live site (`admin` / `school2026`) — but the check now happens server-side against the database, not in the browser's JavaScript, which is far more secure. The principal can add more teacher accounts later directly from the Admin Panel ("Add New User").

## 6. Run the server

```bash
npm start
```

Or, for auto-restart while developing:

```bash
npm run dev
```

Then open: **http://localhost:3000/login.html**

## How it works

- This `public/` folder now contains your colleague's **real, actual website** (all his pages, images, and styling) — not placeholder pages.
- His existing `admin.html` (login + Teachers/Students/Announcements/Babyeyi/Gallery/Security panels) still looks and works exactly as he built it. The only things that changed under the hood:
  - **Login** (`assets/admin.js`) now checks the real database via `/api/auth/login` instead of a hardcoded password.
  - **Babyeyi and Gallery uploads** now save to disk + the database via `/api/photos/upload`, instead of `localStorage`. They show up for every visitor, on every device, and survive a server restart.
  - **"Change admin password"** now actually updates the database via `/api/auth/change-password`.
  - Public pages (`news.html`, `gallery.html`) read uploaded babyeyi/gallery photos straight from the backend (`assets/site.js`), so visitors see real uploads too.
- Everything else — Teachers, Students, Announcements, registrations, donations — is untouched and still works exactly as before (still using `localStorage`, since that wasn't in scope for this pass).

## Adding this into the existing school website

Your colleague's existing site (about.html, programs.html, gallery.html, etc.) can be dropped straight into the `public/` folder alongside `login.html`, `dashboard.html`, and `admin.html` — Express serves all of them as static files automatically. Just make sure their nav links point to `login.html` (they already do, based on the site).

## Extending this

- Add more tables/models the same way `userModel.js` was built (e.g. `studentModel.js`, `newsModel.js`).
- Add matching controllers + routes, and protect them with `requireAuth` / `requireRole(...)` as needed.
- For production, set `cookie.secure: true` in `server.js` once you're serving over HTTPS, and move `SESSION_SECRET` to a real random value.
