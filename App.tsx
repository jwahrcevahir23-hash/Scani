import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GoogleGenAI } from "@google/genai";
import { 
  ArrowLeft, Video, Play, RefreshCw, Loader2, 
  Check, Smartphone, Target, Volume2, VolumeX, 
  LogOut, ChevronRight, Box, MoveRight, MoveLeft,
  Maximize2, Plus, Minus, Image as ImageIcon
} from 'lucide-react';

// --- Components ---
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Intro } from './components/Intro.tsx';
import { SplitFeature } from './components/SplitFeature.tsx';
import { FeaturesGrid } from './components/FeaturesGrid.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { GettingStarted } from './components/GettingStarted.tsx';

// --- Types & Interfaces ---
interface TourNode {
  id: string;
  snapshots: string[];
}

// --- Helper: Relative Angle Calculation ---
// Normalizes angle to -180 to 180 degrees for shortest path rotation
const normalizeAngle = (angle: number) => {
  let a = angle % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
};

// --- Component: AI Video Generator (Veo) ---
const AIVideoGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");

  const handleGenerate = async () => {
    try {
      const aiStudio = (window as any).aistudio;
      if (!aiStudio) {
        alert("AI Studio not initialized.");
        return;
      }
      
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
        await aiStudio.openSelectKey();
      }

      setIsGenerating(true);
      setStatus("Initializing Veo Model...");

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatus("Dreaming up a cinematic tour...");
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'Cinematic tracking shot of a modern minimalist living room, golden hour sunlight, 4k architectural visualization, photorealistic, smooth motion.',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        setStatus("Rendering video frames...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (uri) {
        setStatus("Downloading stream...");
        const res = await fetch(`${uri}&key=${process.env.API_KEY}`);
        const blob = await res.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }

    } catch (e) {
      console.error(e);
      alert("Failed to generate video. Please try again.");
    } finally {
      setIsGenerating(false);
      setStatus("");
    }
  };

  return (
    <div className="bg-slate-950 border-b border-white/10 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-black uppercase tracking-widest text-white px-2 py-1 rounded">
          AI Preview
        </span>
      </div>
      
      {videoUrl ? (
        <div className="flex items-center gap-3">
          <video src={videoUrl} autoPlay loop muted className="h-8 rounded border border-white/20" />
          <button onClick={() => setVideoUrl(null)} className="text-white/50 hover:text-white"><RefreshCw size={14}/></button>
        </div>
      ) : (
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {isGenerating ? <><Loader2 size={12} className="animate-spin" /> {status}</> : <><Play size={12} /> Generate Cinematic Intro</>}
        </button>
      )}
    </div>
  );
};

// --- Component: Spatial 360 Viewer (WebGL) ---
const SpatialViewer: React.FC<{ snapshots: string[], onBack: () => void }> = ({ snapshots, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fov, setFov] = useState(75);
  const [isDragging, setIsDragging] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create a Cylinder to simulate the panorama stitching
    const geometry = new THREE.CylinderGeometry(500, 500, 1000, 60, 1, true);
    geometry.scale(-1, 1, 1); // Invert scale to view from inside

    // Use the first snapshot as a texture (in a real app, we'd stitch them)
    const textureLoader = new THREE.TextureLoader();
    // Fallback if no snapshots captured
    const imgSrc = snapshots.length > 0 ? snapshots[0] : 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200';
    
    const texture = textureLoader.load(imgSrc);
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let lon = 0, lat = 0, phi = 0, theta = 0;
    let onPointerDownPointerX = 0, onPointerDownPointerY = 0, onPointerDownLon = 0, onPointerDownLat = 0;

    const onPointerDown = (event: any) => {
      setIsDragging(true);
      const x = event.clientX || event.touches?.[0]?.clientX;
      const y = event.clientY || event.touches?.[0]?.clientY;
      onPointerDownPointerX = x;
      onPointerDownPointerY = y;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
    };

    const onPointerMove = (event: any) => {
      if (!isDragging) return;
      const x = event.clientX || event.touches?.[0]?.clientX;
      const y = event.clientY || event.touches?.[0]?.clientY;
      lon = (onPointerDownPointerX - x) * 0.1 + onPointerDownLon;
      lat = (y - onPointerDownPointerY) * 0.1 + onPointerDownLat;
    };

    const onPointerUp = () => setIsDragging(false);

    const container = containerRef.current;
    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown);
    container.addEventListener('touchmove', onPointerMove);
    container.addEventListener('touchend', onPointerUp);

    const animate = () => {
      requestAnimationFrame(animate);
      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);
      camera.target = new THREE.Vector3();
      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(camera.target);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      container.removeEventListener('touchmove', onPointerMove);
      container.removeEventListener('touchend', onPointerUp);
      container.innerHTML = '';
    };
  }, [fov, isDragging, snapshots]);

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 left-4 z-50">
         <button onClick={onBack} className="p-3 bg-white/10 backdrop-blur rounded-full text-white hover:bg-white/20 transition-all">
           <ArrowLeft size={24} />
         </button>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur px-6 py-2.5 rounded-full border border-white/10 pointer-events-none">
         <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] self-center">360° Preview</p>
      </div>
    </div>
  );
};

// --- Component: Camera Feed ---
const CameraFeed = forwardRef<any, { active: boolean }>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!props.active) return;
    
    let localStream: MediaStream | null = null;
    let isMounted = true;

    const startCam = async () => {
      try {
        const constraintsList = [
            { video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } },
            { video: { facingMode: 'environment' } },
            { video: true }
        ];

        for (const constraints of constraintsList) {
            try {
                if (!isMounted) return;
                localStream = await navigator.mediaDevices.getUserMedia(constraints);
                break;
            } catch (e) {
                console.warn("Constraint failed:", constraints);
            }
        }

        if (!localStream) throw new Error("No accessible camera found.");

        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = localStream;
        }

      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCam();

    return () => {
      isMounted = false;
      if (localStream) localStream.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [props.active]);

  useImperativeHandle(ref, () => ({
    capture: () => {
      const vid = videoRef.current;
      const cvs = canvasRef.current;
      if (vid && cvs && vid.readyState >= 2) { 
        cvs.width = vid.videoWidth;
        cvs.height = vid.videoHeight;
        const ctx = cvs.getContext('2d');
        if (ctx) {
           ctx.drawImage(vid, 0, 0);
           return cvs.toDataURL('image/jpeg', 0.9);
        }
      }
      return null;
    }
  }));

  return (
    <div className="absolute inset-0 bg-black">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
});

// --- Main Capture Logic ---
const CaptureStudio: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [mode, setMode] = useState<'tutorial' | 'scanning' | 'review'>('tutorial');
  
  // Sensor State
  const [heading, setHeading] = useState(0); // Current phone yaw relative to calibration
  const [tilt, setTilt] = useState(0); // Current phone pitch
  const [calibrationOffset, setCalibrationOffset] = useState(0); // The 'Zero' heading
  
  // Logic State
  const [activeNode, setActiveNode] = useState(0); // 0 to 5
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [lockProgress, setLockProgress] = useState(0); // 0-100%
  const [isSteady, setIsSteady] = useState(false);
  
  const cameraRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastBeepTime = useRef(0);
  const headingRef = useRef(0);
  
  // The 6 points in a 360 circle
  const targets = [0, 60, 120, 180, 240, 300]; 
  const currentTargetAngle = targets[activeNode];

  // --- 1. SENSOR LOGIC (IMU) ---
  useEffect(() => {
    if (mode !== 'scanning') return;

    const handleOrient = (e: DeviceOrientationEvent) => {
      // Use webkitCompassHeading for iOS, alpha for Android
      let rawAlpha = e.alpha || 0;
      if ((e as any).webkitCompassHeading) {
        rawAlpha = (e as any).webkitCompassHeading;
      }
      
      // Simple Low-pass filter for smoothing
      const diff = normalizeAngle(rawAlpha - headingRef.current);
      const smoothed = headingRef.current + diff * 0.15; 
      headingRef.current = smoothed;
      
      // Calculate relative heading (0 = Start Position)
      const relative = normalizeAngle(smoothed - calibrationOffset);
      setHeading(relative);
      
      // Track Tilt (Beta)
      const currentTilt = (e.beta || 0) - 90; // Approx 0 when upright
      setTilt(currentTilt);

      // Stability Check (Stop-and-Shoot Requirement)
      if (Math.abs(diff) < 0.3 && Math.abs(currentTilt) < 15) {
        setIsSteady(true);
      } else {
        setIsSteady(false);
      }
    };

    window.addEventListener('deviceorientation', handleOrient);
    return () => window.removeEventListener('deviceorientation', handleOrient);
  }, [mode, calibrationOffset]);

  // --- 2. TARGET SYSTEM & SONAR ---
  useEffect(() => {
    if (mode !== 'scanning') return;

    const angleDiff = normalizeAngle(currentTargetAngle - heading);
    const absDiff = Math.abs(angleDiff);

    // Audio Sonar Logic
    // If within 40 degrees, start beeping
    if (absDiff < 40) {
      const now = Date.now();
      
      // Beep Speed: Closer = Faster
      // 40deg -> 600ms gap, 0deg -> 80ms gap
      const interval = 80 + (absDiff / 40) * 520;
      
      if (now - lastBeepTime.current > interval) {
        // Pitch: Closer = Higher
        // 40deg -> 400Hz, 0deg -> 1200Hz
        const freq = 1200 - (absDiff / 40) * 800;
        playTone(freq, 0.05);
        lastBeepTime.current = now;
      }
    }

    // Capture Locking Logic
    // Must be within 3.5 degrees AND phone must be steady
    if (absDiff < 3.5 && isSteady) {
      // Increment lock (simulating 1.5s hold)
      setLockProgress(prev => Math.min(prev + 2.5, 100)); 
    } else {
      // Decay lock if user moves away or shakes
      setLockProgress(prev => Math.max(prev - 5, 0));
    }

  }, [heading, currentTargetAngle, isSteady, mode]);

  // --- 3. AUTO CAPTURE TRIGGER ---
  useEffect(() => {
    if (lockProgress >= 100) {
      // Trigger "Shutter"
      playTone(1600, 0.1); 
      setTimeout(() => playTone(2000, 0.2), 100); // Success double-beep
      
      // Capture High-Res Image
      const img = cameraRef.current?.capture();
      if (img) {
        setSnapshots(prev => [...prev, img]);
        
        // Move to next dot or finish
        if (activeNode < targets.length - 1) {
          setActiveNode(n => n + 1);
          setLockProgress(0);
        } else {
          setMode('review');
        }
      }
    }
  }, [lockProgress]);

  // --- Utilities ---
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTone = (freq: number, duration: number) => {
    if (!audioCtxRef.current) return;
    try {
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + duration);
    } catch (e) {}
  };

  const startScan = () => {
    initAudio();
    // Calibrate: Current absolute heading becomes "0"
    setCalibrationOffset(headingRef.current);
    setMode('scanning');
  };

  return (
    <div className="fixed inset-0 bg-black z-50 text-white font-sans overflow-hidden select-none touch-none">
      
      {/* --- HUD HEADER --- */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 pointer-events-none">
        <button onClick={onExit} className="pointer-events-auto p-3 bg-black/20 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-end gap-2">
           <div className={`px-3 py-1 rounded-full border flex items-center gap-2 backdrop-blur-md transition-colors ${isSteady ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
             <div className={`w-2 h-2 rounded-full ${isSteady ? 'bg-green-400' : 'bg-red-400'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest">{isSteady ? 'Stable' : 'Moving'}</span>
           </div>
           {mode === 'scanning' && (
             <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
               <span className="text-xl font-bold font-mono">{activeNode}</span>
               <span className="text-white/40 text-sm font-mono">/6</span>
             </div>
           )}
        </div>
      </div>

      {/* --- CALIBRATION SCREEN --- */}
      {mode === 'tutorial' && (
        <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-12">
            <div className="w-64 h-64 bg-slate-900 rounded-full flex items-center justify-center relative overflow-hidden border border-white/5">
               {/* Animated Calibration Rings */}
               <div className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full animate-[spin_12s_linear_infinite]" />
               <div className="absolute inset-4 border border-white/10 rounded-full" />
               <Smartphone size={64} className="text-white relative z-10" />
               
               {/* Scanning Laser Effect */}
               <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500/50 shadow-[0_0_20px_cyan] animate-[scan-line_2s_ease-in-out_infinite]" />
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-cyan-500/20 blur-3xl rounded-full" />
          </div>
          
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">System Calibration</h2>
          <p className="text-slate-400 max-w-xs mb-12 leading-relaxed text-sm font-medium">
            Stand in the center of the room. Hold your phone upright. This will be the start point of your tour.
          </p>
          
          <button 
            onClick={startScan}
            className="w-full max-w-sm py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Target size={18} /> Initialize
          </button>
        </div>
      )}

      {/* --- SCANNING INTERFACE --- */}
      {mode === 'scanning' && (
        <>
          <CameraFeed ref={cameraRef} active={true} />

          {/* GHOST IMAGE (Feature Matching Aid) */}
          {snapshots.length > 0 && (
             <div className="absolute top-0 bottom-0 left-0 w-16 md:w-24 overflow-hidden border-r border-white/20 z-20 pointer-events-none opacity-60">
                <img 
                  src={snapshots[snapshots.length - 1]} 
                  className="w-[100vw] max-w-none h-full object-cover" 
                  style={{ transform: 'translateX(0)' }} // Show the right edge of previous photo
                  alt="Ghost alignment" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
             </div>
          )}

          {/* SPATIAL AR OVERLAY */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {/* The Horizon Line (Pitch Guide) */}
            <div 
               className="absolute left-0 right-0 h-[1px] bg-white/40 shadow-[0_0_10px_white]" 
               style={{ top: '50%', transform: `translateY(${tilt * 4}px)` }} // Move line opposite to tilt
            />

            {/* Target Dots System */}
            {targets.map((angle, idx) => {
              const diff = normalizeAngle(angle - heading);
              // Only render if roughly in FOV (+/- 45 deg)
              if (Math.abs(diff) > 55) return null;
              
              // Map degrees to screen pixels (Approx 1deg = ~1.5% of width)
              const screenPercent = 50 + (diff * 1.5); 
              
              const isCaptured = idx < snapshots.length;
              const isTarget = idx === activeNode;

              return (
                <div 
                  key={idx}
                  className="absolute top-1/2 -mt-6 -ml-6 w-12 h-12 flex items-center justify-center transition-transform duration-75 will-change-transform"
                  style={{ left: `${screenPercent}%`, transform: `translateY(${tilt * 4}px)` }}
                >
                   {isCaptured ? (
                     <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_cyan] animate-in zoom-in">
                       <Check size={16} className="text-white" />
                     </div>
                   ) : (
                     <div className={`relative flex items-center justify-center transition-all duration-300 ${isTarget ? 'scale-125' : 'scale-75 opacity-40'}`}>
                        {/* Outer Target Ring */}
                        <div className={`w-10 h-10 rounded-full border-2 transition-colors ${isTarget ? 'border-white' : 'border-white/30'}`} />
                        {/* Inner Dot */}
                        <div className={`absolute w-2 h-2 rounded-full ${isTarget ? 'bg-white' : 'bg-white/50'}`} />
                        
                        {isTarget && (
                           <div className="absolute -top-8 text-[10px] font-black uppercase tracking-widest text-cyan-400 drop-shadow-md whitespace-nowrap">
                             Aim Here
                           </div>
                        )}
                     </div>
                   )}
                </div>
              );
            })}

            {/* Central Reticle (The "Lens") */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 flex items-center justify-center">
               {/* Dynamic Lock Ring */}
               <svg className="w-24 h-24 -rotate-90 filter drop-shadow-lg">
                 <circle cx="48" cy="48" r="44" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                 <circle 
                    cx="48" cy="48" r="44" 
                    stroke={isSteady ? '#22d3ee' : '#fff'} 
                    strokeWidth="3" 
                    fill="none" 
                    strokeDasharray="276" 
                    strokeDashoffset={276 - (lockProgress / 100) * 276}
                    strokeLinecap="round"
                    className="transition-all duration-100 ease-linear"
                  />
               </svg>
               
               {/* Directional Chevrons */}
               {Math.abs(normalizeAngle(currentTargetAngle - heading)) > 15 && (
                 <>
                   {normalizeAngle(currentTargetAngle - heading) > 0 ? (
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-pulse flex flex-col items-center opacity-70">
                        <MoveRight className="text-white" size={32} />
                     </div>
                   ) : (
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-pulse flex flex-col items-center opacity-70">
                        <MoveLeft className="text-white" size={32} />
                     </div>
                   )}
                 </>
               )}
            </div>

            {/* Footer Instruction */}
            <div className="absolute bottom-20 left-0 right-0 text-center">
              <div className="inline-block bg-black/60 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
                 <p className="text-sm font-bold tracking-wide text-white">
                   {lockProgress > 0 ? (
                     <span className="text-cyan-400">HOLD STEADY...</span>
                   ) : (
                     <span className="flex items-center gap-2">
                       <Target size={14} /> ALIGN CIRCLE WITH DOT
                     </span>
                   )}
                 </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- REVIEW MODE --- */}
      {mode === 'review' && (
        <SpatialViewer snapshots={snapshots} onBack={onExit} />
      )}

    </div>
  );
};

// --- Component: Landing Page ---
const LandingPage: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans text-slate-900 bg-white">
      <Header isScrolled={isScrolled} onAuthClick={onAuth} />
      <Hero onStart={onAuth} />
      
      {/* AI Video Preview Section */}
      <div className="bg-slate-950 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
           <AIVideoGenerator />
        </div>
      </div>

      <Intro />
      <FeaturesGrid />
      <SplitFeature 
        id="capture"
        title="Guided Capture Workflow"
        description="Never miss a spot with our intuitive capture interface. Visual guides ensure perfect alignment and optimal coverage for seamless 360° stitching."
        bullets={["Live stability feedback", "Automatic horizon leveling", "Gap detection assistant"]}
        imageUrl="https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=800&q=80"
        imageAlt="Mobile capture app interface"
        isMobileMockup={true}
      />
      <GettingStarted onStart={onAuth} />
      <SplitFeature 
        title="Publish & Analyze"
        description="Share your tours instantly with a branded link. Track visitor engagement, heatmaps, and conversion metrics directly from your dashboard."
        bullets={["White-label viewer", "Lead generation forms", "Detailed analytics dashboard"]}
        imageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Analytics dashboard"
        reversed={true}
      />
      <Footer />
    </div>
  );
};

// --- App Wrapper ---
const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'app' | 'admin'>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogin = (type: 'admin' | 'customer') => {
    if (type === 'admin') setView('admin');
    else setView('app');
  };

  return (
    <>
      {view === 'landing' && <LandingPage onAuth={() => setIsAuthOpen(true)} />}
      {view === 'app' && <CaptureStudio onExit={() => setView('landing')} />}
      {view === 'admin' && <AdminDashboard onLogout={() => setView('landing')} />}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLogin} />
    </>
  );
};

export default App;
