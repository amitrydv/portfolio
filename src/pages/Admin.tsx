import { useState, useEffect } from 'react';
import { auth, googleProvider, db, getPortfolioData, savePortfolioData, PortfolioData, defaultData } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        getPortfolioData().then(fetched => {
          setData(fetched);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed.");
    }
  };

  const handleLogout = () => signOut(auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'portraitUrl' | 'backgroundUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Small delay to show UI is working
    setSaving(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_SIZE = 1200;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        setData(prev => ({ ...prev, [fieldName]: dataUrl }));
        setSaving(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomLink = () => {
    setData(prev => ({
      ...prev,
      customLinks: [...(prev.customLinks || []), { id: Date.now().toString(), title: '', url: '' }]
    }));
  };

  const handleCustomLinkChange = (id: string, field: 'title' | 'url', value: string) => {
    setData(prev => ({
      ...prev,
      customLinks: prev.customLinks.map(link => link.id === id ? { ...link, [field]: value } : link)
    }));
  };

  const handleRemoveCustomLink = (id: string) => {
    setData(prev => ({
      ...prev,
      customLinks: prev.customLinks.filter(link => link.id !== id)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.email !== 'amitydv3233@gmail.com') {
      alert("Only amitydv3233@gmail.com can save changes.");
      return;
    }
    setSaving(true);
    try {
      await savePortfolioData(data);
      alert('Saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving data.');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0a0a0a] text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#050505] font-hn relative overflow-hidden">
        <div className="z-10 bg-[#0a0a0a] border border-[#222] p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
          <h1 className="font-syne text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-white/60 text-center text-sm mb-4">Please log in to edit your portfolio content.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Sign in with Google
          </button>
          <Link to="/" className="text-white/40 hover:text-white/80 text-sm mt-4 transition-colors">
            &larr; Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  if (user.email !== 'amitydv3233@gmail.com') {
     return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#050505] font-hn">
         <div className="text-white text-center">
            <h2 className="text-2xl mb-4 text-red-400">Unauthorized</h2>
            <p>You must be amitydv3233@gmail.com to access this dashboard.</p>
            <button onClick={handleLogout} className="mt-6 text-white/50 hover:text-white">Sign Out</button>
         </div>
      </div>
     )
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#050505] font-hn relative py-12 px-6">
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-syne text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/50">Edit your portfolio content</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors">View Live</Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-[#333] text-white/80 hover:bg-[#111] transition-colors">
              Sign Out
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-[#0a0a0a] border border-[#222] p-8 rounded-2xl shadow-2xl flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-sm uppercase tracking-wider">Portrait Image</label>
              <div className="flex gap-4">
                <input 
                  name="portraitUrl" value={data.portraitUrl} onChange={handleChange}
                  placeholder="Paste URL or upload image"
                  className="flex-1 bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" 
                />
                <label className="cursor-pointer bg-[#222] hover:bg-[#333] border border-[#444] rounded-xl px-4 py-3 text-white flex items-center justify-center transition-colors">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'portraitUrl')} />
                </label>
              </div>
              {data.portraitUrl && <img src={data.portraitUrl} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-xl border border-[#333]" />}
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-sm uppercase tracking-wider">Background Image</label>
              <div className="flex gap-4">
                <input 
                  name="backgroundUrl" value={data.backgroundUrl} onChange={handleChange}
                  placeholder="Paste URL or upload image"
                  className="flex-1 bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" 
                />
                <label className="cursor-pointer bg-[#222] hover:bg-[#333] border border-[#444] rounded-xl px-4 py-3 text-white flex items-center justify-center transition-colors">
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'backgroundUrl')} />
                </label>
              </div>
              {data.backgroundUrl && <img src={data.backgroundUrl} alt="Preview" className="mt-4 w-full h-32 object-cover rounded-xl border border-[#333]" />}
            </div>
          </div>

          <hr className="border-[#222]" />

          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-sm uppercase tracking-wider">Story Text</label>
            <textarea 
              name="storyText" value={data.storyText} onChange={handleChange} rows={4}
              className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors resize-y" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-sm uppercase tracking-wider">Jobs Text</label>
            <input 
              name="jobsText" value={data.jobsText} onChange={handleChange}
              className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/70 text-sm uppercase tracking-wider">Projects Text</label>
            <input 
              name="projectsText" value={data.projectsText || ''} onChange={handleChange}
              className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" 
            />
          </div>

          <hr className="border-[#222]" />
          
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
               <label className="text-white/70 text-sm uppercase tracking-wider">Additional Custom Links (GitHub, etc.)</label>
               <button type="button" onClick={handleAddCustomLink} className="text-sm bg-[#222] hover:bg-[#333] px-3 py-1 rounded-md text-white border border-[#444] transition-colors">
                 + Add Link
               </button>
             </div>
             
             {(!data.customLinks || data.customLinks.length === 0) && (
               <p className="text-white/30 text-sm italic">No custom links added yet.</p>
             )}

             {data.customLinks?.map((link, idx) => (
               <div key={link.id} className="flex gap-4 items-center bg-[#111] p-4 rounded-xl border border-[#333]">
                 <input 
                    placeholder="Link Title (e.g. GitHub)"
                    value={link.title} onChange={(e) => handleCustomLinkChange(link.id, 'title', e.target.value)}
                    className="flex-1 bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
                 />
                 <input 
                    placeholder="URL (e.g. https://github.com/...)"
                    value={link.url} onChange={(e) => handleCustomLinkChange(link.id, 'url', e.target.value)}
                    className="flex-[2] bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40"
                 />
                 <button type="button" onClick={() => handleRemoveCustomLink(link.id)} className="text-red-400 hover:text-red-300 px-2">
                    &times;
                 </button>
               </div>
             ))}
          </div>

          <hr className="border-[#222]" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-white/70 text-sm uppercase tracking-wider">WhatsApp User</label>
                <input 
                  name="whatsappUsername" value={data.whatsappUsername} onChange={handleChange}
                  className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" 
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-white/70 text-sm uppercase tracking-wider">Instagram Link</label>
                <input 
                  name="instagramLink" value={data.instagramLink} onChange={handleChange}
                  className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" 
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-white/70 text-sm uppercase tracking-wider">LinkedIn Link</label>
                <input 
                  name="linkedinLink" value={data.linkedinLink} onChange={handleChange}
                  className="bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors" 
                />
             </div>
          </div>

          <div className="pt-4 flex justify-end">
             <button 
                type="submit" disabled={saving}
                className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
             >
                {saving ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
