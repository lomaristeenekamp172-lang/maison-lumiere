import { getStore } from "@netlify/blobs";
import { timingSafeEqual } from "node:crypto";

const json = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req) => {
  const store = getStore("photos");
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  const isOwner = () => {
    const a = Buffer.from(req.headers.get("x-owner-code") || "");
    const b = Buffer.from(process.env.OWNER_CODE || "");
    return b.length > 0 && a.length === b.length && timingSafeEqual(a, b);
  };

  if (req.method === "GET") {
    if (id) {
      const buf = await store.get(id, { type: "arrayBuffer" });
      if (!buf) return new Response("Not found", { status: 404 });
      return new Response(buf, { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable" } });
    }
    const { blobs } = await store.list();
    return json({ ids: blobs.map((b) => b.key).sort() });
  }

  if (!isOwner()) return json({ error: "Forbidden" }, 403);

  if (req.method === "POST") {
    if (url.searchParams.get("action") === "check") return json({ ok: true });
    const { data } = await req.json();
    if (!data || data.length > 3_000_000) return json({ error: "Invalid image" }, 400);
    const newId = Date.now() + "-" + Math.random().toString(36).slice(2, 7);
    await store.set(newId, Buffer.from(data, "base64"));
    return json({ id: newId });
  }

  if (req.method === "DELETE" && id) {
    await store.delete(id);
    return json({ ok: true });
  }
  return json({ error: "Bad request" }, 400);
};
