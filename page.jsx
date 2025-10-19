"use client";
import { useEffect, useRef, useState } from "react";

/**
 * ChaoticColors – Single page with built‑in editors
 * - Everything you need is on this one page.
 * - Upload images (local only), paste URLs, edit titles/links/prices.
 * - Data is saved in your browser (localStorage). No backend required.
 */

// ---------- tiny helpers ----------
const ls = {
  get(key, fallback) {
    if (typeof window === "undefined") return fallback;
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

export default function HomePage() {
  // -------------- About --------------
  const [aboutText, setAboutText] = useState(
    ls.get(
      "cc_about_text_v1",
      "Hi! I'm ChaoticColors. I create acrylic pour art that feels alive — full of motion, color and texture."
    )
  );
  const [aboutImg, setAboutImg] = useState(ls.get("cc_about_img_v1", ""));
  const aboutFileRef = useRef(null);

  useEffect(() => { ls.set("cc_about_text_v1", aboutText); }, [aboutText]);
  useEffect(() => { ls.set("cc_about_img_v1", aboutImg); }, [aboutImg]);

  const onChooseAboutImg = (files) => {
    if (!files?.[0]) return;
    const reader = new FileReader();
    reader.onload = () => setAboutImg(String(reader.result));
    reader.readAsDataURL(files[0]);
  };

  // -------------- Gallery --------------
  const [gallery, setGallery] = useState(ls.get("cc_gallery_v1", [])); // [{src,title,href}]
  const [galleryEditing, setGalleryEditing] = useState(true);
  const [galleryPasteOpen, setGalleryPasteOpen] = useState(false);
  const gFileRef = useRef(null);
  const gPasteRef = useRef(null);
  useEffect(() => { ls.set("cc_gallery_v1", gallery); }, [gallery]);

  const filesToDataURLs = async (files) =>
    Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve({ src: r.result, title: file.name.replace(/\.[^.]+$/, ""), href: "" });
            r.onerror = reject;
            r.readAsDataURL(file);
          })
      )
    );

  const onGalleryFiles = async (files) => {
    if (!files?.length) return;
    const items = await filesToDataURLs(files);
    setGallery((prev) => [...prev, ...items]);
  };

  const addGalleryFromUrls = (text) => {
    const urls = (text || "")
      .split(/\n|,|\s/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!urls.length) return;
    setGallery((prev) => [
      ...prev,
      ...urls.map((u, i) => ({ src: u, title: `Artwork ${prev.length + i + 1}`, href: "" })),
    ]);
    setGalleryPasteOpen(false);
  };

  const updateGalleryItem = (i, patch) => setGallery((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const removeGalleryItem = (i) => setGallery((prev) => prev.filter((_, idx) => idx !== i));
  const resetGallery = () => setGallery([]);

  // -------------- Shop --------------
  const [shop, setShop] = useState(ls.get("cc_shop_v1", [])); // [{src,title,price,href}]
  const [shopEditing, setShopEditing] = useState(true);
  const [shopPasteOpen, setShopPasteOpen] = useState(false);
  const sFileRef = useRef(null);
  const sPasteRef = useRef(null);
  useEffect(() => { ls.set("cc_shop_v1", shop); }, [shop]);

  const onShopFiles = async (files) => {
    if (!files?.length) return;
    const items = await filesToDataURLs(files);
    setShop((prev) => [
      ...prev,
      ...items.map((x) => ({ ...x, price: "From $39", href: "" })),
    ]);
  };

  const addShopFromUrls = (text) => {
    const urls = (text || "")
      .split(/\n|,|\s/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!urls.length) return;
    setShop((prev) => [
      ...prev,
      ...urls.map((u, i) => ({ src: u, title: `Product ${prev.length + i + 1}`, price: "From $39", href: "" })),
    ]);
    setShopPasteOpen(false);
  };

  const updateShopItem = (i, patch) => setShop((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const removeShopItem = (i) => setShop((prev) => prev.filter((_, idx) => idx !== i));
  const resetShop = () => setShop([]);

  // -------------- Contact --------------
  const CONTACT_EMAIL = "hello@chaoticcolors.art";
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cMsg, setCMsg] = useState("");
  const sendContact = () => {
    const subject = `ChaoticColors Inquiry from ${cName || "Website Visitor"}`;
    const body = `Name: ${cName}\nEmail: ${cEmail}\n\nMessage:\n${cMsg}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <a href="#top" className="font-semibold tracking-wide">ChaoticColors</a>
          <nav className="hidden md:flex gap-6 text-sm text-white/80">
            <a href="#about" className="hover:text-white">About</a>
            <a href="#gallery" className="hover:text-white">Gallery</a>
            <a href="#shop" className="hover:text-white">Shop</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <a href="#shop" className="rounded-xl border border-teal-400/60 px-3 py-1.5 text-sm hover:bg-teal-400/10">Browse Prints</a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[64vh] border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1600&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-[0_0_28px_#14b8a6]">ChaoticColors</h1>
          <p className="mt-3 text-white/85 tracking-widest">by ChaoticColorDesigns</p>
        </div>
      </section>

      {/* Quick help */}
      <div className="mx-auto max-w-7xl px-4 mt-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <b>How to edit:</b> Use the buttons in each section. Upload turns files into base64 so they persist locally. Paste URLs to use links. Your changes autosave in your browser.
        </div>
      </div>

      {/* Gallery */}
      <section id="gallery" className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-teal-300">Gallery</h2>
              <p className="text-xs text-white/60">Show your artwork. Edit mode is ON by default.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setGalleryEditing((v) => !v)} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">
                {galleryEditing ? "Done" : "Edit Gallery"}
              </button>
              <button onClick={() => gFileRef.current?.click()} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Upload Images</button>
              <button onClick={() => setGalleryPasteOpen((v) => !v)} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">{galleryPasteOpen ? "Close Paste" : "Paste URLs"}</button>
              <button onClick={resetGallery} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Reset</button>
              <input ref={gFileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && onGalleryFiles(e.target.files)} />
            </div>
          </div>

          {galleryPasteOpen && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 mb-5">
              <p className="text-xs text-white/70 mb-2">Paste direct image links (each on a new line) then click Add.</p>
              <textarea ref={gPasteRef} className="w-full h-24 bg-transparent border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-teal-400/60" placeholder="https://...jpg\nhttps://...png" />
              <div className="mt-2 flex gap-2">
                <button onClick={() => addGalleryFromUrls(gPasteRef.current?.value || "")} className="rounded-lg border border-teal-400/60 px-3 py-1.5 text-sm hover:bg-teal-400/10">Add</button>
                <button onClick={() => setGalleryPasteOpen(false)} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Cancel</button>
              </div>
            </div>
          )}

          {gallery.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center"
                 onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
                 onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files; if (f?.length) onGalleryFiles(f); }}>
              <p className="text-white/80">Drop images here, click <b>Upload Images</b>, or use <b>Paste URLs</b>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, i) => (
                <div key={i} className="group rounded-2xl overflow-hidden border border-teal-500/30 bg-gradient-to-b from-black via-zinc-900 to-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.title || `Artwork ${i + 1}`} className="w-full aspect-[4/3] object-cover" />
                  <div className="p-4">
                    {galleryEditing ? (
                      <div className="grid gap-2">
                        <input value={item.title || ""} onChange={(e) => updateGalleryItem(i, { title: e.target.value })} placeholder={`Artwork ${i + 1}`} className="bg-transparent border border-white/15 rounded-lg px-2 py-1 text-sm outline-none focus:border-teal-400/60" />
                        <input value={item.href || ""} onChange={(e) => updateGalleryItem(i, { href: e.target.value })} placeholder="Optional link (product page)" className="bg-transparent border border-white/15 rounded-lg px-2 py-1 text-xs outline-none focus:border-teal-400/60" />
                        <div className="flex gap-2">
                          <button onClick={() => removeGalleryItem(i)} className="text-xs rounded-lg border border-white/20 px-3 py-1 hover:bg-white/10">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.title || `Artwork ${i + 1}`}</p>
                          <p className="text-xs text-white/60">Acrylic Pour</p>
                        </div>
                        <a className="text-xs rounded-lg border border-teal-400/60 px-3 py-1 hover:bg-teal-400/10" href={item.href || "#"} target={item.href ? "_blank" : undefined} rel={item.href ? "noreferrer" : undefined}>View</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="py-12 bg-zinc-900 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-teal-300">Shop</h3>
              <p className="text-xs text-white/60">Add items and paste your Printify product links for the Buy button.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShopEditing((v) => !v)} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">{shopEditing ? "Done" : "Edit Shop"}</button>
              <button onClick={() => sFileRef.current?.click()} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Upload Images</button>
              <button onClick={() => setShopPasteOpen((v) => !v)} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">{shopPasteOpen ? "Close Paste" : "Paste Image URLs"}</button>
              <button onClick={resetShop} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Reset</button>
              <input ref={sFileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && onShopFiles(e.target.files)} />
            </div>
          </div>

          {shopPasteOpen && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 mb-5">
              <p className="text-xs text-white/70 mb-2">Paste product image links (each on a new line) then click Add.</p>
              <textarea ref={sPasteRef} className="w-full h-24 bg-transparent border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-teal-400/60" placeholder="https://...jpg\nhttps://...png" />
              <div className="mt-2 flex gap-2">
                <button onClick={() => addShopFromUrls(sPasteRef.current?.value || "")} className="rounded-lg border border-teal-400/60 px-3 py-1.5 text-sm hover:bg-teal-400/10">Add</button>
                <button onClick={() => setShopPasteOpen(false)} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Cancel</button>
              </div>
            </div>
          )}

          {shop.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center">
              <p className="text-white/80">No products yet. Use <b>Upload Images</b> or <b>Paste Image URLs</b>, then edit each card.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shop.map((item, i) => (
                <div key={i} className="group rounded-2xl overflow-hidden border border-teal-500/30 bg-gradient-to-b from-black via-zinc-900 to-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.title || `Product ${i + 1}`} className="w-full aspect-[4/3] object-cover" />
                  <div className="p-4">
                    {shopEditing ? (
                      <div className="grid gap-2">
                        <input value={item.title || ""} onChange={(e) => updateShopItem(i, { title: e.target.value })} placeholder={`Product ${i + 1}`} className="bg-transparent border border-white/15 rounded-lg px-2 py-1 text-sm outline-none focus:border-teal-400/60" />
                        <input value={item.price || ""} onChange={(e) => updateShopItem(i, { price: e.target.value })} placeholder="From $39" className="bg-transparent border border-white/15 rounded-lg px-2 py-1 text-sm outline-none focus:border-teal-400/60" />
                        <input value={item.href || ""} onChange={(e) => updateShopItem(i, { href: e.target.value })} placeholder="Printify product link (https://...)" className="bg-transparent border border-white/15 rounded-lg px-2 py-1 text-xs outline-none focus:border-teal-400/60" />
                        <div className="flex gap-2">
                          <button onClick={() => removeShopItem(i)} className="text-xs rounded-lg border border-white/20 px-3 py-1 hover:bg-white/10">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium mb-1 group-hover:text-teal-300 transition">{item.title || `Product ${i + 1}`}</h4>
                        <p className="text-sm text-white/60 mb-3">{item.price || "From $39"}</p>
                        <a className="inline-block text-center rounded-xl border border-teal-400/60 px-4 py-1.5 text-sm text-teal-300 hover:bg-teal-400/10" href={item.href || "#"} target={item.href ? "_blank" : undefined} rel={item.href ? "noreferrer" : undefined}>Buy</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold text-teal-300">About</h3>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="mt-3 w-full min-h-[160px] bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-teal-400/60"
            />
            <div className="mt-3 flex gap-2">
              <button onClick={() => aboutFileRef.current?.click()} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Upload Image</button>
              <button onClick={() => setAboutImg("")} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Remove Image</button>
              <input ref={aboutFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onChooseAboutImg(e.target.files)} />
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-[4/3] flex items-center justify-center">
            {aboutImg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={aboutImg} alt="About" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/40 text-sm">(Optional image or portrait can go here)</span>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 bg-black border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">Get in touch</h3>
            <p className="mt-2 text-white/70 text-sm">Questions, custom work, or wholesale? I’d love to hear from you.</p>
            <p className="mt-3 text-sm text-white/60">Email: <a className="underline decoration-dotted hover:text-teal-300" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </div>
          <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); sendContact(); }}>
            <input value={cName} onChange={(e) => setCName(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-teal-400/60" placeholder="Your name" />
            <input value={cEmail} onChange={(e) => setCEmail(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-teal-400/60" placeholder="Your email" />
            <textarea value={cMsg} onChange={(e) => setCMsg(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 h-28 outline-none focus:border-teal-400/60" placeholder="Tell me about your space..." />
            <div className="flex gap-2">
              <button type="submit" className="rounded-xl border border-teal-400/60 px-4 py-2 hover:bg-teal-400/10">Send</button>
              <button type="button" onClick={() => { setCName(""); setCEmail(""); setCMsg(""); }} className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10">Clear</button>
            </div>
            <p className="text-xs text-white/50">This opens your email app and drafts a message to {CONTACT_EMAIL}.</p>
          </form>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-white/50 border-t border-white/10">© {new Date().getFullYear()} ChaoticColors</footer>
    </div>
  );
}
