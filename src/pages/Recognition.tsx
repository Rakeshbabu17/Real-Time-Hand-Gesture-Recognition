import React, { useRef, useState, useEffect } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export function Recognition() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isDetectingRef = useRef<boolean>(false);
  const lastDetectionTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize TensorFlow.js and MediaPipe
  useEffect(() => {
    const initializeModels = async () => {
      try {
        // Initialize TensorFlow.js
        setDebugInfo('Initializing TensorFlow.js...');
        await tf.ready();
        await tf.setBackend('webgl');
        console.log('TensorFlow.js initialized successfully');
        
        // Load MediaPipe vision tasks
        setDebugInfo('Loading MediaPipe vision tasks...');
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        console.log('MediaPipe vision tasks loaded');
        
        // Create HandLandmarker
        setDebugInfo('Creating HandLandmarker...');
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        console.log('HandLandmarker options created');

        if (!handLandmarker) {
          throw new Error('Failed to create HandLandmarker');
        }

        handLandmarkerRef.current = handLandmarker;
        console.log('HandLandmarker created successfully');
        setDebugInfo(null);
        setIsLoading(false);
      } catch (error) {
        console.error('Model initialization error:', error);
        setError('Failed to initialize models. Please refresh the page and try again.');
        setIsLoading(false);
      }
    };

    initializeModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isDetectingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setCanvasCtx(ctx);
    }
  }, []);

  const drawHandLandmarks = (landmarks: any[], width: number, height: number) => {
    if (!canvasCtx || !canvasRef.current) return;

    canvasCtx.clearRect(0, 0, width, height);
    
    // Draw landmarks
    landmarks.forEach((landmark) => {
      const x = landmark.x * width;
      const y = landmark.y * height;
      
      // Draw point
      canvasCtx.beginPath();
      canvasCtx.arc(x, y, 4, 0, 2 * Math.PI);
      canvasCtx.fillStyle = '#00ff00';
      canvasCtx.fill();
      
      // Draw outline
      canvasCtx.strokeStyle = '#ffffff';
      canvasCtx.lineWidth = 2;
      canvasCtx.stroke();
    });

    // Draw connections between landmarks
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],  // thumb
      [0, 5], [5, 6], [6, 7], [7, 8],  // index
      [0, 9], [9, 10], [10, 11], [11, 12],  // middle
      [0, 13], [13, 14], [14, 15], [15, 16],  // ring
      [0, 17], [17, 18], [18, 19], [19, 20],  // pinky
      [0, 5], [5, 9], [9, 13], [13, 17]  // palm
    ];

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      canvasCtx.beginPath();
      canvasCtx.moveTo(startPoint.x * width, startPoint.y * height);
      canvasCtx.lineTo(endPoint.x * width, endPoint.y * height);
      canvasCtx.strokeStyle = '#00ff00';
      canvasCtx.lineWidth = 2;
      canvasCtx.stroke();
    });
  };

  const detectCallGesture = (landmarks: any[]): boolean => {
    // Get thumb and little finger tips
    const thumbTip = landmarks[4];
    const littleTip = landmarks[20];
    
    // Get middle finger tip and ring finger tip for checking if they're closed
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    
    // Check if thumb and little finger are extended
    const thumbExtended = thumbTip.y < landmarks[3].y; // Thumb is above its base
    const littleExtended = littleTip.y < landmarks[19].y; // Little finger is above its base
    
    // Check if middle and ring fingers are closed
    const middleClosed = middleTip.y > landmarks[11].y; // Middle finger is below its base
    const ringClosed = ringTip.y > landmarks[15].y; // Ring finger is below its base
    
    // Calculate distance between thumb and little finger
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - littleTip.x, 2) + 
      Math.pow(thumbTip.y - littleTip.y, 2)
    );
    
    // Gesture is detected if:
    // 1. Thumb and little finger are extended
    // 2. Middle and ring fingers are closed
    // 3. Thumb and little finger are at a reasonable distance apart
    return thumbExtended && littleExtended && middleClosed && ringClosed && distance > 0.3;
  };

  const detectGesture = async (timestamp: number) => {
    if (!videoRef.current || !handLandmarkerRef.current || !isDetectingRef.current) {
      console.log('Detection skipped: missing requirements', {
        video: !!videoRef.current,
        handLandmarker: !!handLandmarkerRef.current,
        isDetecting: isDetectingRef.current
      });
      return;
    }

    try {
      // Check if video is ready
      if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        console.log('Video not ready:', videoRef.current.readyState);
        animationFrameRef.current = requestAnimationFrame(detectGesture);
        return;
      }

      // Throttle detection rate
      const now = Date.now();
      if (now - lastDetectionTimeRef.current < 100) { // 10 fps max
        animationFrameRef.current = requestAnimationFrame(detectGesture);
        return;
      }
      lastDetectionTimeRef.current = now;

      const results = handLandmarkerRef.current.detectForVideo(videoRef.current, timestamp);
      
      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;
        
        // Update canvas size to match video
        if (canvasRef.current) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
          drawHandLandmarks(landmarks, videoWidth, videoHeight);
        }
        
        if (landmarks) {
          // Check for call gesture first
          if (detectCallGesture(landmarks)) {
            setCurrentGesture('Call');
            setConfidence(0.95);
            animationFrameRef.current = requestAnimationFrame(detectGesture);
            return;
          }

          // Get key points
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const middleTip = landmarks[12];
          const ringTip = landmarks[16];
          const pinkyTip = landmarks[20];
          const wrist = landmarks[0];
          const pinkyMcp = landmarks[17]; // Base of pinky

          // Calculate all distances
          const thumbIndexDist = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) +
            Math.pow(thumbTip.y - indexTip.y, 2)
          );

          const indexMiddleDist = Math.sqrt(
            Math.pow(indexTip.x - middleTip.x, 2) +
            Math.pow(indexTip.y - middleTip.y, 2)
          );

          // Calculate angles between fingers for victory sign
          const indexAngle = Math.atan2(indexTip.y - landmarks[5].y, indexTip.x - landmarks[5].x);
          const middleAngle = Math.atan2(middleTip.y - landmarks[9].y, middleTip.x - landmarks[9].x);
          const angleBetweenFingers = Math.abs(indexAngle - middleAngle);

          // Improved finger extension detection with stricter thresholds
          const fingersExtended = [
            indexTip.y < landmarks[5].y - 0.15,  // index
            middleTip.y < landmarks[9].y - 0.15,  // middle
            ringTip.y < landmarks[13].y - 0.15,   // ring
            pinkyTip.y < landmarks[17].y - 0.15   // pinky
          ];

          const numExtendedFingers = fingersExtended.filter(Boolean).length;
          
          // Calculate finger curls with improved accuracy
          const fingerCurls = [
            Math.sqrt(Math.pow(indexTip.x - landmarks[5].x, 2) + Math.pow(indexTip.y - landmarks[5].y, 2)),
            Math.sqrt(Math.pow(middleTip.x - landmarks[9].x, 2) + Math.pow(middleTip.y - landmarks[9].y, 2)),
            Math.sqrt(Math.pow(ringTip.x - landmarks[13].x, 2) + Math.pow(ringTip.y - landmarks[13].y, 2)),
            Math.sqrt(Math.pow(pinkyTip.x - landmarks[17].x, 2) + Math.pow(pinkyTip.y - landmarks[17].y, 2))
          ];

          // Improved curl detection
          const fingersCurled = fingerCurls.map(curl => curl < 0.12);
          const allFingersCurled = fingersCurled.every(Boolean);

          // Victory gesture detection (✌️)
          const isVictory = 
            fingersExtended[0] && fingersExtended[1] && // Index and middle fingers extended
            !fingersExtended[2] && !fingersExtended[3] && // Ring and pinky closed
            indexMiddleDist < 0.15 && // Fingers close together
            Math.abs(indexTip.y - middleTip.y) < 0.1 && // Similar height
            angleBetweenFingers < Math.PI / 6; // Angle between fingers less than 30 degrees

          // Happy/OK gesture detection (👌)
          const isHappy = 
            Math.abs(thumbTip.x - indexTip.x) < 0.15 && // Thumb and index close horizontally
            Math.abs(thumbTip.y - indexTip.y) < 0.15 && // Thumb and index close vertically
            Math.abs(thumbTip.z - indexTip.z) < 0.15 && // Similar depth
            fingersExtended[1] && fingersExtended[2] && fingersExtended[3]; // Other fingers extended

          // Gun gesture detection (🔫)
          const isGun = 
            fingersExtended[0] && // Index finger extended
            !fingersExtended[1] && !fingersExtended[2] && !fingersExtended[3] && // Other fingers closed
            Math.abs(thumbTip.y - landmarks[2].y) < 0.1; // Thumb roughly perpendicular

          // Pointing Up gesture detection (👆)
          const isPointingUp = 
            fingersExtended[0] && // Index finger extended
            !fingersExtended[1] && !fingersExtended[2] && !fingersExtended[3] && // Other fingers closed
            indexTip.y < landmarks[5].y - 0.15; // Index finger clearly extended up

          // Hello gesture detection (👋)
          const isHello = 
            fingersExtended[0] && fingersExtended[1] && fingersExtended[2] && fingersExtended[3] && // All fingers extended
            Math.abs(indexTip.y - middleTip.y) < 0.1 && // All fingers at similar height
            Math.abs(middleTip.y - ringTip.y) < 0.1 &&
            Math.abs(ringTip.y - pinkyTip.y) < 0.1;

          // Thumbs Up gesture detection (👍)
          const isThumbsUp = 
            !fingersExtended[0] && !fingersExtended[1] && !fingersExtended[2] && !fingersExtended[3] && // All fingers closed
            thumbTip.y < wrist.y - 0.15 && // Thumb above wrist
            Math.abs(thumbTip.x - wrist.x) < 0.15; // Thumb close to wrist horizontally

          // Thumbs Down gesture detection (👎)
          const isThumbsDown = 
            !fingersExtended[0] && !fingersExtended[1] && !fingersExtended[2] && !fingersExtended[3] && // All fingers closed
            thumbTip.y > wrist.y + 0.15 && // Thumb below wrist
            Math.abs(thumbTip.x - wrist.x) < 0.15; // Thumb close to wrist horizontally

          // Angry gesture detection (😠)
          const isAngry = 
            fingersExtended[3] && // Only pinky extended
            !fingersExtended[0] && !fingersExtended[1] && !fingersExtended[2] && // Other fingers closed
            Math.abs(thumbTip.x - wrist.x) < 0.12; // Thumb close to palm

          // I Love You gesture detection (🤟)
          const isILoveYou = 
            fingersExtended[0] && // Index finger extended
            !fingersExtended[1] && !fingersExtended[2] && // Middle and ring fingers closed
            fingersExtended[3] && // Pinky finger extended
            Math.abs(thumbTip.y - wrist.y) < 0.2 && // Thumb not too far from wrist
            Math.abs(indexTip.y - pinkyTip.y) < 0.3 && // Index and pinky at similar height
            Math.abs(indexTip.x - pinkyTip.x) > 0.15; // Index and pinky spread apart

          // Friends gesture detection (three fingers extended)
          const isFriends = 
            fingersExtended[0] && fingersExtended[1] && fingersExtended[2] && // Index, middle, ring fingers extended
            !fingersExtended[3] && // Pinky closed
            Math.abs(indexTip.y - middleTip.y) < 0.2 && // Index and middle at similar height
            Math.abs(middleTip.y - ringTip.y) < 0.2 && // Middle and ring at similar height
            thumbTip.y < wrist.y - 0.1 && // Thumb extended upward
            Math.abs(thumbTip.x - wrist.x) < 0.2; // Thumb not too far horizontally

          // Gesture detection priority order with confidence scores
          let detectedGesture = null;
          let gestureConfidence = 0;

          if (isVictory) {
            detectedGesture = 'Victory';
            gestureConfidence = 0.95;
          } else if (isHappy) {
            detectedGesture = 'Super';
            gestureConfidence = 0.95;
          } else if (isGun) {
            detectedGesture = 'Happy';
            gestureConfidence = 0.95;
          } else if (isPointingUp) {
            detectedGesture = 'Pointing';
            gestureConfidence = 0.95;
          } else if (isHello) {
            detectedGesture = 'Hello';
            gestureConfidence = 0.95;
          } else if (isThumbsUp) {
            detectedGesture = 'Like';
            gestureConfidence = 0.9;
          } else if (isThumbsDown) {
            detectedGesture = 'Dislike';
            gestureConfidence = 0.95;
          } else if (isFriends) {
            detectedGesture = 'Friends';
            gestureConfidence = 0.95;
          } else if (isILoveYou) {
            detectedGesture = 'I Love You';
            gestureConfidence = 0.95;
          } else if (isAngry) {
            detectedGesture = 'Angry';
            gestureConfidence = 0.95;
          }

          // Update gesture state immediately
          setCurrentGesture(detectedGesture);
          setConfidence(gestureConfidence);
        }
      } else {
        if (canvasCtx && canvasRef.current) {
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        // Immediately set to null when no gesture is detected
        setCurrentGesture(null);
        setConfidence(0);
      }
    } catch (error) {
      console.error('Gesture detection error:', error);
      setError('Error during gesture detection. Please refresh the page.');
      setCurrentGesture(null);
      setConfidence(0);
    }

    // Always request next frame
    animationFrameRef.current = requestAnimationFrame(detectGesture);
  };

  const startCamera = async () => {
    try {
      setError(null);
      setDebugInfo('Requesting camera access...');

      // Check if models are initialized
      if (!handLandmarkerRef.current) {
        setError('Models are not yet initialized. Please wait or refresh the page.');
        return;
      }

      // Check video element before requesting camera
      if (!videoRef.current) {
        console.error('Video element reference is null');
        setError('Failed to initialize video element. Please refresh the page.');
        return;
      }

      // Request camera with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        }
      });

      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Set up video element
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error('Video element not found during metadata load'));
          return;
        }
        videoRef.current.onloadedmetadata = () => resolve();
        videoRef.current.onerror = () => reject(new Error('Failed to load video stream'));
      });

      console.log('Starting video playback');
      await videoRef.current.play();
      
      // Start detection
      setHasPermission(true);
      isDetectingRef.current = true;
      animationFrameRef.current = requestAnimationFrame(detectGesture);
      setDebugInfo(null);
      
      console.log('Camera initialized successfully');
    } catch (error) {
      console.error('Camera access error:', error);
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setError('Camera access denied. Please grant camera permissions and try again.');
      } else if (error instanceof DOMException && error.name === 'NotFoundError') {
        setError('No camera found. Please ensure your device has a working camera.');
      } else if (error instanceof Error && error.message.includes('Video element')) {
        setError('Failed to initialize video. Please refresh the page and try again.');
      } else {
        setError('Failed to access camera. Please check your camera connection and try again.');
      }
      setHasPermission(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <motion.h1
          className="text-4xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Hand Gesture Recognition
        </motion.h1>
      </div>

      <div className="flex flex-row items-start justify-center gap-8">
        {/* Webcam container */}
        <div className="relative w-full max-w-3xl aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {/* Loading and error states */}
          <AnimatePresence>
            {(isLoading || !hasPermission || error) && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center p-6">
                  {isLoading && (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4" />
                      <p className="text-lg">{debugInfo || 'Loading...'}</p>
                    </>
                  )}
                  {!hasPermission && !error && (
                    <button
                      onClick={startCamera}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Enable Camera
                    </button>
                  )}
                  {error && (
                    <div className="flex items-center text-red-500">
                      <AlertCircle className="h-6 w-6 mr-2" />
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gesture display on the right */}
        <div className="w-64 bg-white p-6 rounded-lg shadow-lg">
          <motion.div
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {currentGesture || 'No gesture detected'}
          </motion.div>
          {currentGesture && (
            <motion.div
              className="text-lg text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Confidence: {(confidence * 100).toFixed(1)}%
            </motion.div>
          )}
          
          {/* Instructions */}
          <motion.p
            className="mt-6 text-base text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Position your hand clearly in front of the camera for best results
          </motion.p>
        </div>
      </div>
    </div>
  );
} 