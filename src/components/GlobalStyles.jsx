export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: #F1F5F9; }
      ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 2px; }
      .contact-row { cursor: pointer; border-bottom: 1px solid #F1F5F9; transition: background 0.12s; }
      .contact-row:hover { background: #F8FAFC !important; }
      .contact-row.active { background: #EFF6FF !important; border-left: 3px solid #0284C7; }
      .tab-btn { cursor: pointer; transition: all 0.12s; border: none; background: transparent; }
      .tab-btn.active { background: #EFF6FF !important; border-bottom: 2px solid #0284C7 !important; color: #0284C7 !important; }
      .tab-btn:hover:not(.active) { background: #F8FAFC !important; }
      .gen-btn { cursor: pointer; transition: all 0.12s; border: none; }
      .gen-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
      .gen-btn:active:not(:disabled) { transform: translateY(0); }
      .filter-btn { cursor: pointer; transition: all 0.12s; border: none; }
      .filter-btn.active { background: #0284C7 !important; color: #FFFFFF !important; }
      .filter-btn:hover:not(.active) { background: #E2E8F0 !important; }
      .msg-area { resize: none; font-family: 'IBM Plex Mono', monospace; font-size: 12px; line-height: 1.8; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 6px; color: #374151; width: 100%; padding: 14px; outline: none; transition: border-color 0.15s; }
      .msg-area:focus { border-color: #0284C7; box-shadow: 0 0 0 3px #E0F2FE; }
      .copy-btn { cursor: pointer; transition: all 0.12s; border: none; }
      .copy-btn:hover { opacity: 0.8; }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
      .loading-dot { animation: pulse 1.2s ease-in-out infinite; }
      @keyframes slideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      .slide-in { animation: slideIn 0.2s ease-out; }
      .progress-bar { transition: width 0.3s ease; }
      .sender-input { border: none; outline: none; background: transparent; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #374151; width: 120px; border-bottom: 1px dashed #CBD5E1; }
      .sender-input:focus { border-bottom-color: #0284C7; }
    `}</style>
  );
}
