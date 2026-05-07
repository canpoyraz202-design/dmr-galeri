import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StoredPhoto,
  getAllPhotos,
  addPhoto,
  deletePhoto,
  updatePhoto,
  fileToDataURL,
} from './db';

// ==================== AUTH ====================

const VALID_USERNAME = 'halil01dmr';
const VALID_PASSWORD = 'Kral01xd';
const AUTH_KEY = 'halil01dmr_auth';

function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

function login(username: string, password: string): boolean {
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
}

// ==================== TYPES ====================

type Category = 'all' | 'dogal' | 'sehir' | 'portre' | 'diger';

const categories: { key: Category; label: string; icon: string }[] = [
  { key: 'all', label: 'Tümü', icon: '🎨' },
  { key: 'dogal', label: 'Doğa', icon: '🌿' },
  { key: 'sehir', label: 'Şehir', icon: '🌃' },
  { key: 'portre', label: 'Portre', icon: '👤' },
  { key: 'diger', label: 'Diğer', icon: '📷' },
];

const categoryOptions = categories.filter((c) => c.key !== 'all');

// ==================== TOAST ====================

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-fade-up rounded-xl px-6 py-3 text-sm font-bold text-white shadow-2xl ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {type === 'success' ? '✅ ' : '❌ '}
      {message}
    </div>
  );
}

// ==================== LOGIN PAGE ====================

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (login(username, password)) {
        onLogin();
      } else {
        setError('Kullanıcı adı veya şifre yanlış!');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-3xl font-black text-white shadow-2xl shadow-purple-500/30 mb-4">
            H
          </div>
          <h1 className="text-3xl font-black">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              halil01dmr
            </span>
          </h1>
          <p className="mt-2 text-sm text-white/40">Fotoğraf galerisine hoş geldin</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white">Giriş Yap</h2>
            <p className="mt-1 text-sm text-white/40">Galeriyi görüntülemek için giriş yap</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">Kullanıcı Adı</label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Kullanıcı adını gir"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-white/30 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/70">Şifre</label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Şifreni gir"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-12 text-white placeholder-white/30 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-fade-in">
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!username || !password || loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-sm font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Giriş yapılıyor...
                </span>
              ) : (
                'Giriş Yap 🔐'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/20">
          🔒 Bu alan özel bir galeridir. Yetkisiz erişim yasaktır.
        </p>
      </div>
    </div>
  );
}

// ==================== UPLOAD MODAL ====================

function UploadModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StoredPhoto['category']>('diger');
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleSubmit = async () => {
    if (!file || !title.trim()) return;
    setLoading(true);
    try {
      const data = await fileToDataURL(file);
      await addPhoto({ data, title: title.trim(), category });
      onUploaded();
      onClose();
    } catch {
      alert('Fotoğraf kaydedilirken hata oluştu.');
    }
    setLoading(false);
  };

  const [dragging, setDragging] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="relative mx-4 w-full max-w-lg rounded-3xl border border-white/10 bg-[#151515] p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors text-xl">✕</button>
        <h2 className="text-2xl font-black text-white mb-6">📸 Fotoğraf Yükle</h2>

        <div
          className={`relative mb-6 flex min-h-[200px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
            dragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-[250px] rounded-xl object-contain" />
          ) : (
            <div className="text-center p-6">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-white/60 text-sm">Fotoğraf sürükle veya <span className="text-purple-400 font-bold">tıkla</span></p>
              <p className="text-white/30 text-xs mt-2">JPG, PNG, WEBP desteklenir</p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-white/70">Başlık *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Fotoğraf başlığı..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-white/70">Kategori</label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button key={cat.key} onClick={() => setCategory(cat.key as StoredPhoto['category'])}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${category === cat.key ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!file || !title.trim() || loading}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]">
          {loading ? '⏳ Kaydediliyor...' : '🚀 Yükle ve Kaydet'}
        </button>
      </div>
    </div>
  );
}

// ==================== EDIT MODAL ====================

function EditModal({ photo, onClose, onSaved }: { photo: StoredPhoto; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(photo.title);
  const [category, setCategory] = useState(photo.category);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await updatePhoto(photo.id, { title: title.trim(), category });
    onSaved();
    onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="relative mx-4 w-full max-w-md rounded-3xl border border-white/10 bg-[#151515] p-8 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors text-xl">✕</button>
        <h2 className="text-xl font-black text-white mb-6">✏️ Düzenle</h2>
        <div className="mb-4 rounded-xl overflow-hidden"><img src={photo.data} alt={photo.title} className="w-full max-h-[200px] object-cover" /></div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold text-white/70">Başlık</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-white/70">Kategori</label>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button key={cat.key} onClick={() => setCategory(cat.key as StoredPhoto['category'])}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${category === cat.key ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSave} disabled={!title.trim() || loading}
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 text-sm font-bold text-white transition-all disabled:opacity-40 active:scale-[0.98]">
          {loading ? '⏳ Kaydediliyor...' : '💾 Kaydet'}
        </button>
      </div>
    </div>
  );
}

// ==================== DELETE CONFIRM ====================

function DeleteConfirm({ title, onConfirm, onCancel }: { title: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" onClick={onCancel}>
      <div className="mx-4 w-full max-w-sm rounded-3xl border border-white/10 bg-[#151515] p-8 text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="text-4xl mb-4">🗑️</div>
        <h3 className="text-xl font-black text-white mb-2">Fotoğrafı Sil?</h3>
        <p className="text-sm text-white/50 mb-6"><strong className="text-white/70">"{title}"</strong> silinecek. Bu işlem geri alınamaz.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl bg-white/10 py-3 text-sm font-bold text-white/70 transition-all hover:bg-white/15">İptal</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition-all hover:bg-red-500 active:scale-95">Sil</button>
        </div>
      </div>
    </div>
  );
}

// ==================== LIGHTBOX ====================

function Lightbox({ photo, onClose, onPrev, onNext }: { photo: StoredPhoto; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);

  const catLabel = categories.find((c) => c.key === photo.category);

  return (
    <div className="lightbox-overlay fixed inset-0 z-40 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in" onClick={onClose}>
      <button onClick={onClose} className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-110">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      <div className="relative max-h-[85vh] max-w-[90vw] animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <img src={photo.data} alt={photo.title} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" />
        <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-xl font-bold text-white">{photo.title}</h3>
          <p className="text-sm text-white/60 mt-1">{catLabel?.icon} {catLabel?.label}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== NAVBAR ====================

function Navbar({ onSectionClick, onLogout }: { onSectionClick: (s: string) => void; onLogout: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl shadow-lg shadow-black/20' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <button onClick={() => onSectionClick('hero')} className="text-2xl font-black tracking-tight text-white">
          halil<span className="text-purple-400">01</span>dmr
        </button>
        <div className="hidden md:flex items-center gap-8">
          {[['Hakkımda', 'about'], ['Galeri', 'gallery'], ['İletişim', 'contact']].map(([label, id]) => (
            <button key={id} onClick={() => onSectionClick(id)} className="text-sm font-medium text-white/70 hover:text-white transition-colors">{label}</button>
          ))}
          <button onClick={onLogout} className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Çıkış
          </button>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/70 hover:text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 animate-fade-in">
          <div className="flex flex-col px-6 py-4 gap-4">
            {[['Hakkımda', 'about'], ['Galeri', 'gallery'], ['İletişim', 'contact']].map(([label, id]) => (
              <button key={id} onClick={() => { onSectionClick(id); setMobileOpen(false); }} className="text-left text-base font-medium text-white/70 hover:text-white py-2">{label}</button>
            ))}
            <button onClick={() => { onLogout(); setMobileOpen(false); }} className="text-left text-base font-medium text-red-400 hover:text-red-300 py-2 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ==================== MAIN APP ====================

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editPhoto, setEditPhoto] = useState<StoredPhoto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoredPhoto | null>(null);
  const [contextMenu, setContextMenu] = useState<{ photo: StoredPhoto; x: number; y: number } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadPhotos = useCallback(async () => {
    try {
      const all = await getAllPhotos();
      setPhotos(all);
    } catch {
      showToast('Fotoğraflar yüklenemedi', 'error');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadPhotos();
  }, [authed, loadPhotos]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const filteredPhotos = activeCategory === 'all' ? photos : photos.filter((p) => p.category === activeCategory);

  const scrollToSection = useCallback((section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePhoto(deleteTarget.id);
      showToast('Fotoğraf silindi', 'success');
      setDeleteTarget(null);
      loadPhotos();
    } catch {
      showToast('Silinemedi', 'error');
    }
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () => {
    if (lightboxIndex !== null) setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : filteredPhotos.length - 1);
  };
  const nextPhoto = () => {
    if (lightboxIndex !== null) setLightboxIndex(lightboxIndex < filteredPhotos.length - 1 ? lightboxIndex + 1 : 0);
  };

  useEffect(() => {
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  // ========== LOGIN SCREEN ==========
  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />;
  }

  // ========== MAIN SITE ==========
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" onClick={() => setContextMenu(null)}>
      <Navbar onSectionClick={scrollToSection} onLogout={handleLogout} />

      {/* ===== HERO ===== */}
      <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 animate-gradient" />
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-purple-600/20 blur-[120px] animate-float" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-blue-600/15 blur-[150px] animate-float delay-500" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-600/10 blur-[100px] animate-float delay-300" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 px-6 text-center">
          <div className="animate-fade-up mb-8 inline-block">
            <div className="relative">
              <div className="h-36 w-36 sm:h-44 sm:w-44 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1 shadow-2xl shadow-purple-500/30">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a0a] text-5xl sm:text-6xl font-black">H</div>
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-lg shadow-lg ring-4 ring-[#0a0a0a]">✓</div>
            </div>
          </div>

          <h1 className="animate-fade-up delay-200 text-5xl sm:text-7xl md:text-8xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">halil01dmr</span>
          </h1>

          <p className="animate-fade-up delay-400 mt-6 text-lg sm:text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
            Fotoğraf tutkunu 📸 • Dijital sanat meraklısı 🎨 • Doğa ve şehir kaşifi 🌍
          </p>

          <div className="animate-fade-up delay-600 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => scrollToSection('gallery')} className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105 active:scale-95">
              Galeriye Göz At
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            <button onClick={() => setUploadOpen(true)} className="flex items-center gap-2 rounded-full border-2 border-dashed border-purple-500/50 px-8 py-4 text-sm font-bold text-purple-400 transition-all hover:bg-purple-500/10 hover:border-purple-400 hover:scale-105 active:scale-95">
              + Fotoğraf Yükle
            </button>
          </div>

          <div className="animate-fade-up delay-800 mt-20 flex flex-col items-center gap-2">
            <span className="text-xs text-white/30 tracking-widest uppercase">Kaydır</span>
            <div className="h-10 w-6 rounded-full border-2 border-white/20 flex justify-center pt-2">
              <div className="h-2 w-1 rounded-full bg-white/40 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="relative py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 aspect-[4/5] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">📸</div>
                  <p className="text-white/40 text-sm">Kendi fotoğraflarını yükle!</p>
                </div>
              </div>
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-purple-400">Hakkımda</span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-black leading-tight">
                Merhaba, ben <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Halil</span> 👋
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/60">
                Fotoğrafçılığa olan tutkum, doğanın eşsiz güzelliklerini ve şehirlerin büyüleyici atmosferini yakalamamı sağlıyor.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/60">
                Bu galeriye kendi fotoğraflarını yükleyebilirsin! Fotoğraflar tarayıcında güvenle saklanır.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6">
                {[
                  { num: `${photos.length}`, label: 'Fotoğraf' },
                  { num: `${new Set(photos.map((p) => p.category)).size}`, label: 'Kategori' },
                  { num: '∞', label: 'Tutku' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{stat.num}</div>
                    <div className="mt-1 text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" className="relative py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <span className="text-sm font-bold uppercase tracking-widest text-purple-400">Galeri</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black">
              Fotoğraf <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Koleksiyonum</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-lg mx-auto">Dünyayı farklı açılardan görüntülüyorum.</p>
          </div>

          <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                    activeCategory === cat.key ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}>
                  {cat.icon} {cat.label}
                  {cat.key !== 'all' && <span className="ml-1 text-xs opacity-60">({photos.filter((p) => p.category === cat.key).length})</span>}
                </button>
              ))}
            </div>
            <button onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-105 active:scale-95 whitespace-nowrap">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Fotoğraf Yükle
            </button>
          </div>

          {loading && (
            <div className="py-20 text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
              <p className="mt-4 text-white/40">Fotoğraflar yükleniyor...</p>
            </div>
          )}

          {!loading && filteredPhotos.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-2xl font-bold text-white/40 mb-2">{activeCategory === 'all' ? 'Henüz fotoğraf yok' : 'Bu kategoride fotoğraf yok'}</h3>
              <p className="text-white/30 mb-8">İlk fotoğrafını yükleyerek galerini oluştur!</p>
              <button onClick={() => setUploadOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                İlk Fotoğrafını Yükle
              </button>
            </div>
          )}

          {!loading && filteredPhotos.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filteredPhotos.map((photo, index) => (
                <div key={photo.id} className="gallery-item group relative cursor-pointer break-inside-avoid overflow-hidden rounded-2xl"
                  onClick={() => openLightbox(index)} onContextMenu={(e) => { e.preventDefault(); setContextMenu({ photo, x: e.clientX, y: e.clientY }); }}>
                  {!loadedImages.has(photo.id) && <div className="aspect-square bg-white/5 animate-pulse rounded-2xl" />}
                  <img src={photo.data} alt={photo.title}
                    className={`w-full object-cover transition-all duration-500 ${loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setLoadedImages((prev) => new Set(prev).add(photo.id))} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="text-lg font-bold text-white">{photo.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{categories.find((c) => c.key === photo.category)?.icon} {categories.find((c) => c.key === photo.category)?.label}</p>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 scale-75 group-hover:scale-100">
                    <button onClick={(e) => { e.stopPropagation(); setEditPhoto(photo); }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all" title="Düzenle">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(photo); }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/50 backdrop-blur-sm text-white hover:bg-red-500/80 transition-all" title="Sil">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="relative py-24 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest text-purple-400">İletişim</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black">
              Benimle <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">İletişime Geç</span>
            </h2>
            <p className="mt-4 text-white/50">Bir proje, iş birliği veya sadece merhaba demek için yazabilirsin!</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 backdrop-blur-sm">
            <form onSubmit={(e) => { e.preventDefault(); showToast('Mesajın gönderildi! 🎉', 'success'); }} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">İsim</label>
                  <input type="text" placeholder="Adınız" className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-white placeholder-white/30 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">E-posta</label>
                  <input type="email" placeholder="mail@ornek.com" className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-white placeholder-white/30 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/70">Mesaj</label>
                <textarea rows={5} placeholder="Mesajınızı yazın..." className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-white placeholder-white/30 outline-none transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20" />
              </div>
              <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-sm font-bold text-white shadow-xl shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]">Mesaj Gönder 🚀</button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-8">
          <div className="text-2xl font-black">halil<span className="text-purple-400">01</span>dmr</div>
          <div className="flex items-center gap-4">
            {[
              { svg: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>, hover: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600' },
              { svg: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, hover: 'hover:bg-white hover:text-black' },
              { svg: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>, hover: 'hover:bg-white hover:text-black' },
              { svg: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, hover: 'hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-500' },
            ].map(({ svg, hover }, i) => (
              <a key={i} href="#" className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all hover:scale-110 hover:text-white ${hover}`}>{svg}</a>
            ))}
          </div>
          <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="text-sm text-white/30">© 2025 halil01dmr • Tüm hakları saklıdır ❤️</p>
        </div>
      </footer>

      {/* ===== MODALS ===== */}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onUploaded={() => { loadPhotos(); showToast('Fotoğraf başarıyla yüklendi! 📸', 'success'); }} />}
      {editPhoto && <EditModal photo={editPhoto} onClose={() => setEditPhoto(null)} onSaved={() => { loadPhotos(); showToast('Fotoğraf güncellendi! ✏️', 'success'); }} />}
      {deleteTarget && <DeleteConfirm title={deleteTarget.title} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <Lightbox photo={filteredPhotos[lightboxIndex]} onClose={closeLightbox} onPrev={prevPhoto} onNext={nextPhoto} />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div className="fixed z-50 min-w-[180px] rounded-xl border border-white/10 bg-[#1a1a1a] p-2 shadow-2xl animate-scale-in"
          style={{ left: contextMenu.x, top: contextMenu.y }} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setEditPhoto(contextMenu.photo); setContextMenu(null); }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors">✏️ Düzenle</button>
          <button onClick={() => { openLightbox(filteredPhotos.findIndex((p) => p.id === contextMenu.photo.id)); setContextMenu(null); }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors">🔍 Büyüt</button>
          <div className="my-1 h-px bg-white/10" />
          <button onClick={() => { setDeleteTarget(contextMenu.photo); setContextMenu(null); }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">🗑️ Sil</button>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
