"use client";

import React, { useEffect, useRef, useState } from "react";

// Minimal one-file player for a Telegram Mini App or any webpage
// Replace the preview/full URLs with your files. Works offline without Telegram too.
// If opened inside Telegram, it adapts theme and expands.

// ---------- Demo data: replace with your beats ----------
type Track = {
  id: string;
  title: string;
  bpm?: number;
  key?: string;
  cover: string; // 1080x1080 recommended
  url: string; // MP3 preview or full
};

const TRACKS: Track[] = [
  {
    id: "beat-1",
    title: "Night Drive",
    bpm: 140,
    key: "Am",
    cover:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1080&auto=format&fit=crop",
    url: "https://file-examples.com/storage/fe1a9f0f3b7d8c7e0e65b20/2017/11/file_example_MP3_1MG.mp3",
  },
  {
    id: "beat-2",
    title: "City Lights",
    bpm: 150,
    key: "Cm",
    cover:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1080&auto=format&fit=crop",
    url: "https://file-examples.com/storage/fe1a9f0f3b7d8c7e0e65b20/2017/11/file_example_MP3_2MG.mp3",
  },
  {
    id: "beat-3",
    title: "Neon Pulse",
    bpm: 132,
    key: "Dm",
    cover:
      "https://images.unsplash.com/photo-1517711423161-3a9c7f6e74b4?q=80&w=1080&auto=format&fit=crop",
    url: "https://file-examples.com/storage/fe1a9f0f3b7d8c7e0e65b20/2017/11/file_example_MP3_5MG.mp3",
  },
];

// ---------- Minimal licenses (placeholder, connect payments later) ----------
type License = { id: string; name: string; price: number; perks: string[] };
const LICENSES: License[] = [
  {
    id: "basic",
    name: "Basic",
    price: 20,
    perks: ["MP3", "Non‑exclusive", "1 video"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 49,
    perks: ["WAV", "Non‑exclusive", "3 videos"],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: 99,
    perks: ["WAV + Stems", "Unlimited streams & videos"],
  },
];

// ---------- Helper UI atoms ----------
const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <button
    className={
      "rounded-2xl px-4 py-2 shadow-sm border border-black/10 bg-white/70 hover:bg-white active:scale-[0.98] transition text-sm " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

function formatTime(sec: number) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ---------- Main component ----------
export default function MiniBeatsPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // in seconds
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [loop, setLoop] = useState(false);
  const track = TRACKS[current];
  const [showBuy, setShowBuy] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Telegram Mini App theme integration (safe for browser use)
  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp;
    try {
      if (tg) {
        tg.expand();
        tg.enableClosingConfirmation();
        tg.setHeaderColor("secondary_bg_color");
      }
    } catch (_) {}
  }, []);

  // Load new source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.url;
    audio.load();
    audio.loop = loop;
    audio.volume = volume;
    setProgress(0);
    setDuration(0);
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [current]);

  // Keep audio props in sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loop;
  }, [loop]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  function onLoadedMetadata() {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
  }

  function onTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime || 0);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setProgress(t);
  }

  function next() {
    setCurrent((i) => (i + 1) % TRACKS.length);
  }

  function prev() {
    setCurrent((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }

  function onEnded() {
    if (loop) return; // audio element will handle loop
    next();
  }

  return (
    <div className="min-h-screen w-full bg-[rgb(245,246,248)] text-black flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-black/5 overflow-hidden">
        {/* Cover */}
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={track.cover}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="p-4 grid gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                {track.title}
              </h1>
              <p className="text-xs text-black/60 mt-1">
                {track.bpm ? `${track.bpm} BPM` : ""}
                {track.bpm && track.key ? " · " : ""}
                {track.key || ""}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wide bg-black text-white rounded-full px-2 py-1 self-start">
              Preview
            </span>
          </div>

          {/* Progress */}
          <div className="grid gap-1">
            <input
              type="range"
              min={0}
              max={Math.max(1, duration)}
              step={0.01}
              value={progress}
              onChange={seek}
              className="w-full accent-black"
            />
            <div className="flex justify-between text-[11px] text-black/60">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <IconButton onClick={prev}>⏮️</IconButton>
            <IconButton
              onClick={togglePlay}
              className="text-base px-6 py-3 font-medium"
            >
              {isPlaying ? "⏸️ Pause" : "▶️ Play"}
            </IconButton>
            <IconButton onClick={next}>⏭️</IconButton>
          </div>

          {/* Buy button (minimal) */}
          <button
            onClick={() => setShowBuy(true)}
            className="mt-2 w-full rounded-2xl px-4 py-3 bg-black text-white font-medium active:scale-[0.98]"
          >
            Buy
          </button>

          {/* Bottom bar */}
          <div className="flex items-center justify-between gap-3 mt-1">
            <label className="text-xs text-black/60 flex items-center gap-2">
              🔁 Loop
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
              />
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-black/60">Vol</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="accent-black"
              />
            </div>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          preload="metadata"
        />

        {/* Simple list below to jump between tracks */}
        <div className="border-t border-black/5 divide-y">
          {TRACKS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setCurrent(i)}
              className={`w-full text-left px-4 py-3 hover:bg-black/5 transition ${
                i === current ? "bg-black/[0.04]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.cover}
                  className="w-10 h-10 rounded-lg object-cover"
                  alt={t.title}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-[11px] text-black/60">
                    {t.bpm ? `${t.bpm} BPM` : ""}
                    {t.bpm && t.key ? " · " : ""}
                    {t.key || ""}
                  </div>
                </div>
                {i === current ? <span className="text-xs">▶︎</span> : null}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Minimal modal for license pick */}
      {showBuy && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setShowBuy(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-black/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-black/5 flex items-center justify-between">
              <div className="font-semibold">Choose a license</div>
              <button
                className="text-xs px-2 py-1 rounded-full border"
                onClick={() => setShowBuy(false)}
              >
                Close
              </button>
            </div>
            <div className="p-2">
              {LICENSES.map((lic) => (
                <button
                  key={lic.id}
                  onClick={() => {
                    setSelectedLicense(lic);
                    setShowBuy(false);
                    setShowCheckout(
                      true
                    ); /* Selected: ${lic.name} — $${lic.price}. We'll connect payments next. */
                  }}
                  className="w-full text-left p-3 rounded-2xl hover:bg-black/5 transition grid gap-1 border border-transparent hover:border-black/10 mb-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{lic.name}</div>
                    <div className="text-sm">${lic.price}</div>
                  </div>
                  <div className="text-xs text-black/60">
                    {lic.perks.join(" · ")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Checkout modal */}
      {showCheckout && selectedLicense && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={() => setShowCheckout(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-black/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-black/5 flex items-center justify-between">
              <div className="font-semibold">Checkout</div>
              <button
                className="text-xs px-2 py-1 rounded-full border"
                onClick={() => setShowCheckout(false)}
              >
                Close
              </button>
            </div>
            <div className="p-4 grid gap-3">
              <div className="text-sm">
                Track: <span className="font-medium">{track.title}</span>
              </div>
              <div className="text-sm">
                License:{" "}
                <span className="font-medium">{selectedLicense.name}</span>
              </div>
              <div className="text-sm">
                Total:{" "}
                <span className="font-semibold">${selectedLicense.price}</span>
              </div>

              <button
                className="w-full rounded-2xl px-4 py-3 bg-black text-white font-medium active:scale-[0.98]"
                onClick={() => {
                  const tg = (window as any)?.Telegram?.WebApp;
                  if (!tg) {
                    alert("Open inside Telegram to pay with Stars.");
                    return;
                  }
                  alert("Stars payment – coming next");
                }}
              >
                Pay with Stars
              </button>

              <button
                className="w-full rounded-2xl px-4 py-3 border border-black/10 bg-white hover:bg-black/5 active:scale-[0.98]"
                onClick={() => alert("Card/Crypto coming next")}
              >
                Card / Crypto (soon)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
