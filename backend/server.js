import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();

const PORT = process.env.PORT || 8787;
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "dev-admin-secret";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/invite-app";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const inviteSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  names: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  message: { type: String, required: true },
  template: { type: String, required: true },
  ceremony_time: { type: String },
  ceremony_text: { type: String },
  reception_time: { type: String },
  reception_text: { type: String },
  photo_url: { type: String },
  published: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

const rsvpSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  invite_slug: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  attending: { type: String, required: true },
  guests: { type: Number, default: 0 },
  note: { type: String },
  created_at: { type: Date, default: Date.now }
});

const Invite = mongoose.model('Invite', inviteSchema);
const Rsvp = mongoose.model('Rsvp', rsvpSchema);

const app = express();
app.use(cors({ origin: ORIGIN }));
app.use(express.json({ limit: "2mb" }));

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/api/invites", async (req, res) => {
  try {
    const { title, names, date, location, message, template, photoUrl, ceremonyTime, ceremonyText, receptionTime, receptionText } = req.body || {};
    if (!title || !names || !date || !location || !message || !template) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const baseSlug = slugify(`${names}-${date}`) || nanoid(6);
    let slug = baseSlug;
    let tries = 0;
    while (true) {
      const exists = await Invite.findOne({ slug });
      if (!exists) break;
      tries += 1;
      slug = `${baseSlug}-${tries}`;
    }

    const id = nanoid(10);
    const newInvite = new Invite({
      id,
      slug,
      title,
      names,
      date,
      location,
      message,
      template,
      ceremony_time: ceremonyTime || null,
      ceremony_text: ceremonyText || null,
      reception_time: receptionTime || null,
      reception_text: receptionText || null,
      photo_url: photoUrl || null
    });

    await newInvite.save();

    res.json({ id, slug, adminKey: ADMIN_SECRET });
  } catch (error) {
    console.error("Error creating invite:", error);
    res.status(500).json({ error: "internal_server_error" });
  }
});

app.post("/api/invites/:slug/publish", async (req, res) => {
  try {
    const { slug } = req.params;
    const { adminKey } = req.body || {};
    if (adminKey !== ADMIN_SECRET) return res.status(403).json({ error: "forbidden" });

    const result = await Invite.updateOne({ slug }, { published: 1 });
    if (result.matchedCount === 0) return res.status(404).json({ error: "not_found" });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error publishing invite:", error);
    res.status(500).json({ error: "internal_server_error" });
  }
});

app.get("/api/invites/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const invite = await Invite.findOne({ slug }, 'title names date location message template ceremony_time ceremony_text reception_time reception_text photo_url published -_id');

    if (!invite) return res.status(404).json({ error: "not_found" });
    res.json(invite);
  } catch (error) {
    console.error("Error fetching invite:", error);
    res.status(500).json({ error: "internal_server_error" });
  }
});

app.post("/api/invites/:slug/rsvp", async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, email, attending, guests, note } = req.body || {};
    if (!name || !email || !attending) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const invite = await Invite.findOne({ slug }, 'published');
    if (!invite || !invite.published) return res.status(404).json({ error: "not_found" });

    const id = nanoid(10);
    const newRsvp = new Rsvp({
      id,
      invite_slug: slug,
      name,
      email,
      attending,
      guests: guests || 0,
      note: note || null
    });

    await newRsvp.save();
    res.json({ ok: true });
  } catch (error) {
    console.error("Error sending RSVP:", error);
    res.status(500).json({ error: "internal_server_error" });
  }
});

app.get("/api/invites/:slug/rsvps", async (req, res) => {
  try {
    const { slug } = req.params;
    const adminKey = req.query.adminKey;
    if (adminKey !== ADMIN_SECRET) return res.status(403).json({ error: "forbidden" });

    const list = await Rsvp.find({ invite_slug: slug }, 'name email attending guests note created_at -_id').sort({ created_at: -1 });
    res.json({ rsvps: list });
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    res.status(500).json({ error: "internal_server_error" });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});
