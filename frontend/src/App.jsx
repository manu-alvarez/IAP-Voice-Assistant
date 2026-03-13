import { useState, useRef, useEffect } from 'react';
// Inline SVG Components for high performance and zero dependencies
const IconEye = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconCamera = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const IconMonitor = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
);
const IconGlobe = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconCalendar = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);
const IconMail = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const IconSend = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconTrash2 = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);
const IconMic = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);
const IconMicOff = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" x2="23" y1="1" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
);
const IconSmartphone = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);
import Orb3D from './components/Orb3D';
import './index.css';
import { ORB_BASE64 } from './OrbBase64';

const API_KEY = 'iaputa_sk_7f3a9b2c1d4e5f6a8b9c0d1e2f3a4b5c';
const UI_VERSION = '2.0.3-FIX-' + new Date().getTime();

const STATE_COLORS = {
  ready: 0xa855f7, // Mystic Purple
  listening: 0xff3c3c, // Alert Red
  processing: 0xec4899, // Deep Pink/Magenta
  speaking: 0x00d4ff, // Electric Cyan
  error: 0xff0033
};

const EMOTION_COLORS = {
  happy: 0xffe600,
  sad: 0x3b82f6,
  urgent: 0xff4500,
  angry: 0xff0033,
  thinking: 0xa855f7,
  neutral: 0x00ffb4
};

const TOOLS = [
  { id: 'screenshot', icon: IconMonitor, color: '#a855f7', label: 'Pantalla', sub: 'Captura',
    action: 'screenshot' },
  { id: 'webcam', icon: IconCamera, color: '#ec4899', label: 'Visión', sub: 'IA Cámara',
    action: 'webcam' },
  { id: 'search', icon: IconGlobe, color: '#3b82f6', label: 'Buscar', sub: 'Tavily AI',
    cmd: 'Busca en internet últimas noticias de IA' },
  { id: 'calendar', icon: IconCalendar, color: '#10b981', label: 'Agenda', sub: 'Google',
    cmd: '¿Qué tengo hoy en mi Google Calendar?' },
  { id: 'email', icon: IconMail, color: '#0078d4', label: 'Correo', sub: 'Outlook',
    cmd: 'Léeme mis últimos correos de Hotmail' },
  { id: 'telegram', icon: IconSend, color: '#0ea5e9', label: 'Telegram', sub: 'Bot API',
    cmd: 'Envíame un mensaje por Telegram' },
];

function App() {
  const [orbState, setOrbState] = useState('ready');
  const [emotionColor, setEmotionColor] = useState(STATE_COLORS.ready);
  const [volume, setVolume] = useState(0);
  const [transcript, setTranscript] = useState(null);
  const [visionImage, setVisionImage] = useState(null);
  const [showTools, setShowTools] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const animFrameRef = useRef(null);

  // Helper function to map hex colors to CSS hue-rotate degrees (assuming base orb is roughly blue/cyan)
  const getHueRotation = (hexColor) => {
    const hex = hexColor.toString(16).padStart(6, '0');
    // Simplified mapping based on semantic states since exact color math requires knowing the base image's hue
    if (orbState === 'listening') return 'hue-rotate(320deg) saturate(1.5)';      // Reddish
    if (orbState === 'processing') return 'hue-rotate(270deg) saturate(1.2)';     // Purple/Pink
    if (orbState === 'speaking') return 'hue-rotate(180deg) saturate(1.5)';       // Cyan/Bright
    return 'hue-rotate(0deg)'; // Default/Ready (Keep original image colors)
  };

  // ── Contextual Intelligence: Time of Day ──
  useEffect(() => {
    const updateTimeContext = () => {
      const hour = new Date().getHours();
      let contextualColor = STATE_COLORS.ready;

      if (hour >= 5 && hour < 12) contextualColor = 0x00ffb4; // Dawn/Morning: Mint
      else if (hour >= 12 && hour < 18) contextualColor = 0x00d4ff; // Day: Cyan
      else if (hour >= 18 && hour < 22) contextualColor = 0xffa500; // Dusk: Amber
      else contextualColor = 0xa855f7; // Night: Mystic Purple

      if (orbState === 'ready') setEmotionColor(contextualColor);
      
      // Inject CSS Variable for index.css halo
      const hexColor = '#' + contextualColor.toString(16).padStart(6, '0');
      document.documentElement.style.setProperty('--orb-color', hexColor + '66'); // 40% alpha
    };

    updateTimeContext();
    const timer = setInterval(updateTimeContext, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [orbState]);

  useEffect(() => {
    if (orbState === 'listening') {
      setEmotionColor(STATE_COLORS.listening);
      document.documentElement.style.setProperty('--orb-color', '#ff3c3c66');
    }
    else if (orbState === 'processing') {
      setEmotionColor(STATE_COLORS.processing);
      document.documentElement.style.setProperty('--orb-color', '#ec489966');
    }
    else if (orbState === 'speaking') {
      document.documentElement.style.setProperty('--orb-color', '#00d4ff66');
    }
    else if (orbState === 'error') {
      setEmotionColor(STATE_COLORS.error);
      document.documentElement.style.setProperty('--orb-color', '#ff003366');
    }
  }, [orbState]);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handleAudioPlayback = async (url) => {
    if (!url) { setOrbState('ready'); return; }
    try {
      initAudio();
      const res = await fetch(url);
      if (!res.ok) throw new Error("Audio fetch failed");
      const buffer = await audioContextRef.current.decodeAudioData(await res.arrayBuffer());
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      setOrbState('speaking');
      source.start(0);
      const updateVolume = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const vol = dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
          setVolume(vol);
          animFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };
      updateVolume();
      source.onended = () => { setOrbState('ready'); setVolume(0); cancelAnimationFrame(animFrameRef.current); };
    } catch (err) {
      console.error("Audio err:", err);
      setOrbState('ready');
    }
  };

  const sendCommand = async (endpoint, payload, isJson = true) => {
    initAudio();
    setOrbState('processing');
    setVisionImage(null);
    try {
      const options = { method: 'POST', headers: { 'X-Api-Key': API_KEY }, body: payload };
      if (isJson) options.headers['Content-Type'] = 'application/json';
      const res = await fetch(endpoint, options);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      if (data.emotion && EMOTION_COLORS[data.emotion]) setEmotionColor(EMOTION_COLORS[data.emotion]);
      if (data.vision_url) setVisionImage(data.vision_url);

      // Intercept __VISION_REQUEST__ markers from the backend
      const responseText = data.response || data.error || '';
      if (responseText.startsWith('__VISION_REQUEST__:')) {
        const visionType = responseText.split(':')[1];
        setTranscript({ type: 'system', text: visionType === 'webcam' ? '◈ ACTIVANDO WEBCAM...' : '◈ CAPTURANDO PANTALLA...' });
        if (visionType === 'webcam') {
          await captureWebcam();
        } else {
          await captureScreenshot();
        }
        return;
      }

      setTranscript({ type: 'bot', text: responseText });
      handleAudioPlayback(data.audio_url);
    } catch (err) {
      setOrbState('error');
      setTranscript({ type: 'error', text: `Error: ${err.message}` });
    }
  };

  // ═══ VISION: Capture screenshot via getDisplayMedia ═══
  const captureScreenshot = async () => {
    try {
      setOrbState('processing');
      setTranscript({ type: 'system', text: '◈ SELECCIONA LA PANTALLA A CAPTURAR...' });
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' } });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();
      track.stop();

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.8);

      setTranscript({ type: 'system', text: '◈ ANALIZANDO PANTALLA...' });
      await sendVisionToBackend(base64, 'screenshot');
    } catch (err) {
      console.error('Screenshot error:', err);
      setOrbState('error');
      setTranscript({ type: 'error', text: `Error captura pantalla: ${err.message}` });
    }
  };

  // ═══ VISION: Capture webcam photo via getUserMedia ═══
  const captureWebcam = async () => {
    let stream = null;
    try {
      setOrbState('processing');
      setTranscript({ type: 'system', text: '◈ ACTIVANDO CÁMARA...' });
      
      const constraints = { 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      stream = await navigator.mediaDevices.getUserMedia(constraints);

      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.muted = true;
      
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.play().then(resolve).catch(reject);
        };
        video.onerror = reject;
      });

      // Wait for focus/lighting stabilization
      await new Promise(r => setTimeout(r, 800));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const base64 = canvas.toDataURL('image/jpeg', 0.85);

      setTranscript({ type: 'system', text: '◈ ANALIZANDO IMAGEN...' });
      await sendVisionToBackend(base64, 'webcam');
    } catch (err) {
      console.error('Webcam error:', err);
      setOrbState('error');
      setTranscript({ type: 'error', text: `Error cámara: ${err.name === 'NotAllowedError' ? 'Permiso denegado' : err.message}` });
    } finally {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    }
  };

  // ═══ Send captured image to backend for AI analysis ═══
  const sendVisionToBackend = async (base64Image, source) => {
    try {
      const res = await fetch('/api/vision-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, source })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data.emotion && EMOTION_COLORS[data.emotion]) setEmotionColor(EMOTION_COLORS[data.emotion]);
      if (data.vision_url) setVisionImage(data.vision_url);
      setTranscript({ type: 'bot', text: data.response });
      handleAudioPlayback(data.audio_url);
    } catch (err) {
      setOrbState('error');
      setTranscript({ type: 'error', text: `Error análisis: ${err.message}` });
    }
  };

  const handleToolAction = (tool) => {
    if (tool.action === 'screenshot') {
      captureScreenshot();
    } else if (tool.action === 'webcam') {
      captureWebcam();
    } else if (tool.cmd) {
      handleTextInput(tool.cmd);
    }
  };

  const handleTextInput = (text) => {
    if (!text.trim()) return;
    setTranscript({ type: 'user', text });
    setVisionImage(null);
    setShowTools(false);
    setTimeout(() => sendCommand('/api/text-command', JSON.stringify({ text })), 400);
  };

  const toggleMic = async () => {
    initAudio();
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = e => chunksRef.current.push(e.data);
        mediaRecorderRef.current.onstop = async () => {
          setOrbState('processing');
          setTranscript({ type: 'system', text: '◈ PROCESANDO AUDIO...' });
          setVisionImage(null);
          const type = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? 'audio/mp4' : 'audio/webm';
          const blob = new Blob(chunksRef.current, { type });
          const form = new FormData();
          form.append('audio_file', blob);
          sendCommand('/api/voice-command', form, false);
        };
        mediaRecorderRef.current.start();
        setOrbState('listening');
        setTranscript({ type: 'system', text: '◈ ESCUCHANDO...' });
      } catch (err) {
        setOrbState('error');
        setTranscript({ type: 'error', text: `Mic: ${err.message}` });
      }
    } else {
      mediaRecorderRef.current.stop();
    }
  };

  const stateLabel = orbState === 'ready' ? 'SYSTEM READY' : orbState === 'listening' ? 'RECORDING' : orbState === 'processing' ? 'PROCESSING' : orbState === 'speaking' ? 'SPEAKING' : 'ERROR';
  const stateColor = orbState === 'ready' ? 'text-emerald-400' : orbState === 'listening' ? 'text-red-400' : orbState === 'processing' ? 'text-purple-400' : orbState === 'speaking' ? 'text-cyan-400' : 'text-red-500';

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      {/* Background & Overlay (Fixed & Absolute) */}
      <div className={`cosmic-bg ${orbState}`} />
      <div className={`cosmic-overlay ${orbState}`} />

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="h-[100dvh] w-full flex flex-col relative z-20">

        {/* ── CENTERED HEADER (Logo & Tools) ── */}
        <header className="flex flex-col items-center pt-8 pb-4 md:pt-12 md:pb-6 interactive relative z-30">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl transgressive-text">
              IAPuta <span className="neon-cyan">OS</span>
            </h1>
            
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-1.5 h-1.5 rounded-full ${orbState === 'listening' ? 'bg-red-500 animate-ping' : orbState === 'processing' ? 'bg-purple-500 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
              <span className={`text-[10px] tracking-[0.4em] font-medium uppercase ${stateColor}`}>{stateLabel}</span>
            </div>
          </div>
          
          {/* Tools Row (Centered below logo) */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl px-4">
            {TOOLS.map(t => (
              <button
                key={t.id}
                onClick={() => handleToolAction(t)}
                className="tool-btn px-4 py-2 group flex items-center gap-3 glass-subtle"
              >
                <t.icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-all group-hover:scale-110" style={{ color: t.color }} />
                <span className="text-[10px] font-bold tracking-wider text-white/40 group-hover:text-white/90 uppercase">{t.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* ── ORB AREA (contained) ── */}
        <div className="flex-1 relative flex items-center justify-center min-h-0">
          <div className={`orb-glow ${orbState}`} />
          <div className={`orb-core-container ${orbState}`}>
            {/* Main Plasma Core */}
            <div className="orb-energy-layer main-plasma">
              <img 
                src={ORB_BASE64} 
                alt="Plasma Orb" 
                className="w-full h-full object-contain mix-blend-screen" 
                style={{ filter: getHueRotation(emotionColor) }}
              />
            </div>
            
            {/* Secondary Energy Layer for Chaos/Glow */}
            <div className="orb-energy-layer secondary-plasma">
              <img 
                src={ORB_BASE64} 
                alt="Plasma Aura" 
                className="w-full h-full object-contain mix-blend-screen opacity-50 scale-110" 
                style={{ filter: `${getHueRotation(emotionColor)} blur(8px)` }}
              />
            </div>

            {/* Chaotic Sparkle Layer */}
            <div className="plasma-sparkle" />

            {/* Central Energy Spark (Internal Light) */}
            <div className="absolute w-24 h-24 bg-white rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none" />
          </div>

          {/* Transcript overlay — only show system/error/user/vision, NOT bot text responses */}
          {transcript && (transcript.type === 'system' || transcript.type === 'error' || transcript.type === 'user' || visionImage) && (
            <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl interactive z-20">
              <div className="transcript-bubble px-5 py-4">
                {visionImage && (
                  <div className="mb-3 w-32 h-auto rounded-lg overflow-hidden border border-white/10 shadow-lg">
                    <img src={visionImage} alt="Vision" className="w-full h-full object-cover" />
                  </div>
                )}
                {transcript.type === 'user' ? (
                  <div>
                    <span className="text-[10px] text-white/30 tracking-wider">TÚ</span>
                    <p className="text-sm text-white/70 mt-1">{transcript.text}</p>
                    <span className="text-[10px] text-purple-400 animate-pulse mt-2 block">◈ PROCESANDO...</span>
                  </div>
                ) : transcript.type === 'system' ? (
                  <span className={`text-sm font-bold tracking-wider animate-pulse ${orbState === 'listening' ? 'text-red-400' : 'text-purple-400'}`}>
                    {transcript.text}
                  </span>
                ) : transcript.type === 'error' ? (
                  <span className="text-sm text-red-400 font-bold">{transcript.text}</span>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM CONTROLS ── */}
        <div className="interactive relative z-30 px-4 pb-4 md:px-8 md:pb-6 flex flex-col items-center gap-3">
          
          {/* Text input */}
          <div className="w-full max-w-lg">
            <input
              type="text"
              className="cmd-input w-full px-5 py-3 text-xs text-white/80 placeholder:text-white/20"
              placeholder="Escribe un comando..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTextInput(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-4">
            {/* Clear memory */}
            <button
              onClick={() => fetch('/api/clear-memory', { method: 'POST' })}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-red-500/10 transition-all group"
            >
              <IconTrash2 className="w-4 h-4 text-white/30 group-hover:text-red-400" />
            </button>

            {/* MIC BUTTON */}
            <button
              onClick={toggleMic}
              className={`w-16 h-16 rounded-full mic-btn flex items-center justify-center relative ${orbState === 'listening' ? 'active' : ''}`}
            >
              {orbState === 'listening' ? (
                <IconMicOff className="w-6 h-6 text-red-400" />
              ) : (
                <IconMic className="w-6 h-6 text-white/70" />
              )}
            </button>

            {/* Mobile tools toggle */}
            <button
              onClick={() => setShowTools(!showTools)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-emerald-500/10 transition-all group md:hidden"
            >
              <IconSmartphone className="w-4 h-4 text-white/30 group-hover:text-emerald-400" />
            </button>
          </div>

          <div className="text-[8px] text-white/15 tracking-[0.4em] uppercase">IAPUTA OS — PLASMA INTERFACE v2.3</div>
        </div>

        {/* ── MOBILE TOOLS DRAWER ── */}
        {showTools && (
          <div className="fixed inset-x-0 bottom-0 z-50 bottom-bar p-4 pt-3 md:hidden animate-slide-up">
            <div className="flex justify-center mb-3">
              <div className="w-8 h-1 rounded-full bg-white/20" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TOOLS.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleToolAction(t)}
                  className="tool-btn p-3 flex flex-col items-center gap-1.5"
                >
                  <t.icon className="w-5 h-5" style={{ color: t.color }} />
                  <span className="text-[10px] text-white/60">{t.label}</span>
                  <span className="text-[8px] text-white/25">{t.sub}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTools(false)}
              className="w-full mt-3 py-2 rounded-xl glass text-[10px] text-white/40 tracking-wider hover:text-white/60"
            >
              CERRAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
