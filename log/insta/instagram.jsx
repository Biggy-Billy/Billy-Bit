import { useState, useEffect, useRef } from “react”;

export default function BestDays() {
const [key, setKey] = useState(null);
const [keyInput, setKeyInput] = useState(””);
const [keyError, setKeyError] = useState(false);
const [entries, setEntries] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);
const [view, setView] = useState(“story”);
const [form, setForm] = useState({ photo: null, title: “”, caption: “”, date: “” });
const [loading, setLoading] = useState(true);
const [fading, setFading] = useState(false);
const fileRef = useRef();

useEffect(() => {
const link = document.createElement(“link”);
link.rel = “stylesheet”;
link.href = “https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap”;
document.head.appendChild(link);
setLoading(false);
}, []);

const storageKey = (k) => `best-days-${k.trim()}`;

const handleKeySubmit = async () => {
const trimmed = keyInput.trim();
if (!trimmed) return;
setLoading(true);
try {
const result = await window.storage.get(storageKey(trimmed), true);
const loaded = result?.value ? JSON.parse(result.value) : [];
setEntries(loaded);
} catch (_) { setEntries([]); }
setKey(trimmed);
setLoading(false);
};

const persist = async (list) => {
try { await window.storage.set(storageKey(key), JSON.stringify(list), true); } catch (_) {}
};

const navigate = (dir) => {
if (fading) return;
const next = currentIndex + dir;
if (next < 0 || next >= entries.length) return;
setFading(true);
setTimeout(() => { setCurrentIndex(next); setFading(false); }, 180);
};

const handlePhoto = (e) => {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = () => setForm(f => ({ …f, photo: reader.result }));
reader.readAsDataURL(file);
};

const handleSave = async () => {
if (!form.title.trim() || !form.date) return;
const entry = { id: Date.now(), photo: form.photo, title: form.title, caption: form.caption, date: form.date };
const updated = […entries, entry];
setEntries(updated);
await persist(updated);
setCurrentIndex(updated.length - 1);
setForm({ photo: null, title: “”, caption: “”, date: “” });
setView(“story”);
};

const handleDelete = async () => {
if (!confirm(“Remove this day?”)) return;
const updated = entries.filter((_, i) => i !== currentIndex);
setEntries(updated);
await persist(updated);
setCurrentIndex(Math.max(0, currentIndex - 1));
};

const formatDate = (d) => {
if (!d) return “”;
return new Date(d + “T12:00:00”).toLocaleDateString(“en-AU”, { day: “numeric”, month: “long”, year: “numeric” });
};

const s = {
root: { fontFamily: “‘DM Sans’, sans-serif”, background: “#0D0C0B”, minHeight: “100vh”, color: “#EDE8DF”, display: “flex”, justifyContent: “center”, alignItems: “center” },
shell: { width: “100%”, maxWidth: “390px”, height: “100vh”, position: “relative”, overflow: “hidden”, display: “flex”, flexDirection: “column” },

```
// KEY SCREEN
keyShell: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", height: "100vh", padding: "48px", textAlign: "center", width: "100%", maxWidth: "390px" },
keyTitle: { fontFamily: "'Lora', serif", fontSize: "30px", fontStyle: "italic", color: "#EDE8DF", lineHeight: "1.35" },
keySub: { fontSize: "13px", color: "#5A5550", lineHeight: "1.7", fontWeight: "300", marginTop: "-12px" },
keyInputWrap: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
keyField: { background: "transparent", border: "none", borderBottom: `1px solid ${keyError ? "#C87A7A" : "#2E2C2A"}`, color: "#EDE8DF", fontSize: "28px", padding: "10px 0", width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: "300", textAlign: "center", letterSpacing: "6px", transition: "border-color 0.2s" },
keyError: { fontSize: "12px", color: "#C87A7A", letterSpacing: "1px" },
keyBtn: { padding: "13px 40px", borderRadius: "100px", border: "none", background: "#C8A87A", color: "#0D0C0B", fontSize: "13px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.3px" },

// STORY
card: { flex: 1, position: "relative", opacity: fading ? 0 : 1, transition: "opacity 0.18s ease" },
photo: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
noPhoto: { width: "100%", height: "100%", background: "#181614", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: "#3A3835" },
overlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,7,6,0.92) 0%, rgba(8,7,6,0.5) 45%, rgba(8,7,6,0.15) 70%, transparent 100%)", pointerEvents: "none" },
info: { position: "absolute", bottom: "96px", left: "28px", right: "28px" },
entryDate: { fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#C8A87A", marginBottom: "10px" },
entryTitle: { fontFamily: "'Lora', serif", fontSize: "30px", fontWeight: "600", lineHeight: "1.2", color: "#F5F0E8", marginBottom: "10px" },
entryCaption: { fontSize: "14px", lineHeight: "1.65", color: "rgba(237,232,223,0.72)", fontWeight: "300" },
tapLeft: { position: "absolute", top: 0, left: 0, width: "38%", height: "100%", zIndex: 4, cursor: "pointer" },
tapRight: { position: "absolute", top: 0, right: 0, width: "38%", height: "100%", zIndex: 4, cursor: "pointer" },
counter: { position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", fontSize: "11px", letterSpacing: "2px", color: "rgba(237,232,223,0.5)", textTransform: "uppercase", zIndex: 5, whiteSpace: "nowrap" },
lockBtn: { position: "absolute", top: "16px", right: "20px", zIndex: 10, background: "none", border: "none", color: "rgba(237,232,223,0.35)", fontSize: "16px", cursor: "pointer", padding: "4px" },
actions: { position: "absolute", bottom: "28px", left: "28px", right: "28px", display: "flex", gap: "10px", zIndex: 5 },
btnGhost: { flex: 1, padding: "12px", borderRadius: "100px", border: "1px solid rgba(237,232,223,0.2)", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)", color: "#EDE8DF", fontSize: "13px", cursor: "pointer" },
btnGold: { flex: 2, padding: "12px", borderRadius: "100px", border: "none", background: "#C8A87A", color: "#0D0C0B", fontSize: "13px", fontWeight: "600", cursor: "pointer" },

// EMPTY
empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", height: "100vh", padding: "48px", textAlign: "center" },
emptyTitle: { fontFamily: "'Lora', serif", fontSize: "28px", fontStyle: "italic", fontWeight: "400", lineHeight: "1.3", color: "#EDE8DF" },
emptyBody: { fontSize: "14px", color: "#5A5550", lineHeight: "1.7", fontWeight: "300" },

// ADD
addShell: { width: "100%", maxWidth: "390px", minHeight: "100vh", padding: "56px 28px 40px", display: "flex", flexDirection: "column", gap: "28px", overflowY: "auto" },
addHeading: { fontFamily: "'Lora', serif", fontSize: "24px", fontStyle: "italic", color: "#EDE8DF" },
addSub: { fontSize: "13px", color: "#5A5550", marginTop: "4px", fontWeight: "300" },
uploadBox: { width: "100%", aspectRatio: "3/4", background: "#161412", border: "1px dashed #2E2C2A", borderRadius: "14px", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px", color: "#3A3835" },
uploadImg: { width: "100%", height: "100%", objectFit: "cover" },
fieldWrap: { display: "flex", flexDirection: "column", gap: "6px" },
label: { fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#5A5550" },
input: { background: "transparent", border: "none", borderBottom: "1px solid #2E2C2A", color: "#EDE8DF", fontSize: "15px", padding: "10px 0", width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: "300" },
textarea: { background: "transparent", border: "none", borderBottom: "1px solid #2E2C2A", color: "#EDE8DF", fontSize: "15px", padding: "10px 0", width: "100%", outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "none", height: "80px", fontWeight: "300" },
addActions: { display: "flex", gap: "10px" },
btnCancel: { flex: 1, padding: "13px", borderRadius: "100px", border: "1px solid #2E2C2A", background: "transparent", color: "#EDE8DF", fontSize: "13px", cursor: "pointer" },
btnSave: { flex: 2, padding: "13px", borderRadius: "100px", border: "none", background: "#C8A87A", color: "#0D0C0B", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
```

};

if (loading) return <div style={{ …s.root, color: “#3A3835”, fontSize: “13px” }}>loading…</div>;

// KEY SCREEN
if (!key) return (
<div style={s.root}>
<div style={s.keyShell}>
<div style={s.keyTitle}>the best days<br />of your life</div>
<div style={s.keySub}>enter your key to continue</div>
<div style={s.keyInputWrap}>
<input
style={s.keyField}
type=“password”
placeholder=”····”
value={keyInput}
onChange={e => { setKeyInput(e.target.value); setKeyError(false); }}
onKeyDown={e => e.key === “Enter” && handleKeySubmit()}
autoFocus
/>
{keyError && <div style={s.keyError}>wrong key</div>}
</div>
<button style={s.keyBtn} onClick={handleKeySubmit}>enter</button>
</div>
</div>
);

// ADD VIEW
if (view === “add”) return (
<div style={s.root}>
<div style={s.addShell}>
<div>
<div style={s.addHeading}>a new day</div>
<div style={s.addSub}>something worth keeping</div>
</div>
<div style={s.uploadBox} onClick={() => fileRef.current.click()}>
{form.photo
? <img src={form.photo} style={s.uploadImg} alt="preview" />
: <><div style={{ fontSize: “28px” }}>+</div><div style={{ fontSize: “12px”, letterSpacing: “1px” }}>add a photo</div></>}
<input ref={fileRef} type=“file” accept=“image/*” style={{ display: “none” }} onChange={handlePhoto} />
</div>
<div style={s.fieldWrap}>
<label style={s.label}>title</label>
<input style={s.input} placeholder=“what made this day?” value={form.title} onChange={e => setForm(f => ({ …f, title: e.target.value }))} />
</div>
<div style={s.fieldWrap}>
<label style={s.label}>date</label>
<input style={s.input} type=“date” value={form.date} onChange={e => setForm(f => ({ …f, date: e.target.value }))} />
</div>
<div style={s.fieldWrap}>
<label style={s.label}>caption</label>
<textarea style={s.textarea} placeholder=“anything you want to remember…” value={form.caption} onChange={e => setForm(f => ({ …f, caption: e.target.value }))} />
</div>
<div style={s.addActions}>
<button style={s.btnCancel} onClick={() => setView(“story”)}>cancel</button>
<button style={s.btnSave} onClick={handleSave}>save this day</button>
</div>
</div>
</div>
);

// EMPTY STATE
if (entries.length === 0) return (
<div style={s.root}>
<div style={s.empty}>
<div style={s.emptyTitle}>nothing here yet</div>
<div style={s.emptyBody}>start logging the moments<br />worth remembering</div>
<button style={{ …s.btnGold, padding: “13px 32px”, marginTop: “8px” }} onClick={() => setView(“add”)}>add your first day</button>
<button style={{ fontSize: “12px”, color: “#3A3835”, background: “none”, border: “none”, cursor: “pointer”, marginTop: “4px” }} onClick={() => { setKey(null); setKeyInput(””); }}>← change key</button>
</div>
</div>
);

// STORY VIEW
const entry = entries[currentIndex];

return (
<div style={s.root}>
<div style={s.shell}>
{entries.length > 1 && (
<div style={s.counter}>{currentIndex + 1} / {entries.length}</div>
)}

```
    <button style={s.lockBtn} title="lock" onClick={() => { setKey(null); setKeyInput(""); setEntries([]); }}>🔒</button>

    <div style={s.card}>
      {entry.photo
        ? <img src={entry.photo} style={s.photo} alt={entry.title} />
        : <div style={s.noPhoto}><div style={{ fontSize: "48px" }}>◈</div><div style={{ fontSize: "12px" }}>no photo</div></div>}
      <div style={s.overlay} />
      <div style={s.info}>
        <div style={s.entryDate}>{formatDate(entry.date)}</div>
        <div style={s.entryTitle}>{entry.title}</div>
        {entry.caption && <div style={s.entryCaption}>{entry.caption}</div>}
      </div>
      {currentIndex > 0 && <div style={s.tapLeft} onClick={() => navigate(-1)} />}
      {currentIndex < entries.length - 1 && <div style={s.tapRight} onClick={() => navigate(1)} />}
    </div>

    <div style={s.actions}>
      <button style={s.btnGhost} onClick={handleDelete}>remove</button>
      <button style={s.btnGold} onClick={() => setView("add")}>+ add day</button>
    </div>
  </div>
</div>
```

);
}
