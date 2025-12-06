import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";

function createWatermarkDataUrl(text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 400; canvas.height = 200;
  const ctx = canvas.getContext('2d')!;
  ctx.globalAlpha = 0.12;
  ctx.font = "18px Inter";
  ctx.fillStyle = '#000';
  ctx.translate(0, 0);
  ctx.rotate(-0.5);
  ctx.fillText(text, 30, 100);
  return canvas.toDataURL();
}

export default function SecureNoteViewer(){
  const { id } = useParams();
  const [note, setNote] = useState<any>(null);
  const [watermarkUrl, setWatermarkUrl] = useState<string>("");

  useEffect(()=>{
    async function load(){
      // fetch note - ensure backend RLS restricts access
      const { data } = await supabase.from('notes').select('*').eq('id', id).single();
      setNote(data);
      const user = await supabase.auth.getUser();
      const email = user.data.user?.email ?? 'unknown';
      setWatermarkUrl(createWatermarkDataUrl(`${email} • ${new Date().toLocaleString()}`));
      // log access
      await supabase.from('activity_logs').insert([{ user_id: user.data.user?.id, note_id: id, action: 'view' }]);
    }
    load();
  }, [id]);

  useEffect(()=>{
    // basic client-side deterrents
    const onCopy = (e: ClipboardEvent) => e.preventDefault();
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['s','p','c','x','a'].includes(e.key.toLowerCase())) e.preventDefault();
    };
    document.addEventListener('copy', onCopy);
    document.addEventListener('contextmenu', onContext);
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // log possible background switch
        supabase.from('activity_logs').insert([{ action: 'visibility_hidden', note_id: id }]);
      }
    });
    return () => {
      document.removeEventListener('copy', onCopy as any);
      document.removeEventListener('contextmenu', onContext as any);
      document.removeEventListener('keydown', onKey as any);
    };
  }, [id]);

  if (!note) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen relative bg-white p-8">
      <div className="mb-4"><Link to="/dashboard" className="text-sm">Back</Link></div>

      <div className="relative overflow-hidden border rounded p-6 max-w-4xl mx-auto">
        {/* content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="text-2xl font-bold mb-3">{note.title}</h1>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: note.body }} />
        </div>

        {/* watermark overlay */}
        <div aria-hidden style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          backgroundImage: `url(${watermarkUrl})`,
          backgroundRepeat: 'repeat',
          opacity: 0.9
        }} />
      </div>

      <p className="mt-4 text-sm text-gray-500">Protected viewer — content cannot be downloaded from this page.</p>
    </div>
  );
}
