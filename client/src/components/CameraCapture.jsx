import { useState, useEffect, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CameraOff, AlertCircle, Loader } from 'lucide-react';

const CameraCapture = ({ onExpressionDetected, isActive }) => {
  const videoRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [currentExp, setCurrentExp] = useState('neutral');
  const [confidence, setConfidence] = useState(0);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  // Emojis for expressions
  const expressionEmojis = {
    neutral: '😐',
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    disgusted: '🤢',
    surprised: '😲'
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Load models from jsDelivr CDN
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Error loading face-api models:", err);
        setCameraError("Failed to load facial recognition models.");
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!isActive || !modelsLoaded) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isActive, modelsLoaded]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 225, facingMode: 'user' }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start facial expression detection loop
      startDetectionLoop();
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Camera access denied. Please grant camera permission.");
    }
  };

  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startDetectionLoop = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detection && detection.expressions) {
          const expressions = detection.expressions;
          let maxExp = 'neutral';
          let maxVal = 0;

          // Find the expression with highest probability
          Object.keys(expressions).forEach(exp => {
            if (expressions[exp] > maxVal) {
              maxVal = expressions[exp];
              maxExp = exp;
            }
          });

          // Only update and emit if confidence is > 50%
          if (maxVal > 0.5) {
            setCurrentExp(maxExp);
            setConfidence(Math.round(maxVal * 100));
            onExpressionDetected(maxExp);
          }
        }
      } catch (err) {
        console.error("Error running detection:", err);
      }
    }, 600); // Analyze every 600ms
  };

  if (!isActive) return null;

  return (
    <div className="relative w-full aspect-[4/3] max-w-[280px] bg-slate-900 rounded-2xl overflow-hidden border-2 border-indigo-500/20 shadow-lg flex flex-col items-center justify-center group">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-cover scale-x-[-1] ${
          modelsLoaded && !cameraError ? 'block' : 'hidden'
        }`}
      />

      {!modelsLoaded && !cameraError && (
        <div className="absolute inset-0 flex flex-col items-center gap-3 text-slate-400 p-4 text-center justify-center bg-slate-900">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-sm font-medium">Initializing AI Models...</span>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center gap-3 text-rose-400 p-4 text-center justify-center bg-slate-900">
          <AlertCircle className="w-8 h-8 text-rose-500" />
          <span className="text-xs font-medium">{cameraError}</span>
          <button 
            onClick={startCamera} 
            className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold px-3 py-1.5 rounded-lg transition-colors border border-rose-500/30"
          >
            Retry Camera Access
          </button>
        </div>
      )}

      {modelsLoaded && !cameraError && (
        <>
          {/* Overlays */}
          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold border border-white/10 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Feed
          </div>

          <div className="absolute bottom-3 inset-x-3 bg-slate-950/80 backdrop-blur-md text-white p-2.5 rounded-xl border border-white/10 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label={currentExp}>
                {expressionEmojis[currentExp]}
              </span>
              <div>
                <p className="text-xs font-bold capitalize text-slate-200 leading-tight">
                  {currentExp}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Confidence: {confidence}%
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-indigo-600/30 rounded-lg flex items-center justify-center border border-indigo-500/30">
              <Camera className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
