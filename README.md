<h1 align="center"> Real-Time-Hand-Gesture-Recognition </h1>
<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/Status-Completed-success.svg" alt="Status">
</p>

##  Overview
This project is a hand gesture recognition system built using React, TensorFlow.js, and MediaPipe. It uses a pre-trained MediaPipe Hand Landmarker model to detect and track 21 landmarks on a hand in real-time video. The system recognizes various gestures like Victory, Peace, Friends, and others through geometric calculations based on the relative positions of these landmarks. The application provides a user-friendly interface that displays the detected gesture and visualizes the hand landmarks on a canvas. The project combines deep learning for hand tracking with rule-based logic for gesture recognition, making it efficient and accurate for real-time gesture detection in a web browser environment.

- The project uses MediaPipe's pre-trained Hand Landmarker model for real-time hand tracking and landmark detection in video frames.
- TensorFlow.js provides the machine learning infrastructure and GPU acceleration for running the hand tracking model efficiently in the browser.
- The system implements geometric calculations and rule-based logic to detect various hand gestures like Victory, Peace, and Friends in real-time.
- The application provides a user-friendly interface with real-time visualization of hand landmarks and detected gestures using HTML5 Canvas overlay.

---

##  Features
- **Hand Tracking**:  Uses MediaPipe Hand Landmarker model to track 21 landmarks on the hand in real-time with GPU acceleration.
- **Gesture Recognition**: Detects multiple hand gestures using geometric calculations.
- **Visualization**: Displays real-time hand landmarks, connection lines, and gesture text overlay on the video feed using HTML5 Canvas.

---

## Tech Stack

### Frontend:
- **HTML, CSS, JavaScript** (for UI/UX)
- **TypeScript** (Main language)

---

## 🛠 Installation
### Step 1: Clone the Repository
```sh
git clone https://github.com/Rakeshbabu17/Real-Time-Hand-Gesture-Recognition.git 
```

### Step 2: Run the Frontend
 `npm run dev`


**Expected Output:**
```
 * Running on http://127.0.0.1:5000/
```

## Usage
1. **Setup**: Open the project in a web browser, allow camera access when prompted, and wait for the model to load with the loading indicator.
2. **Making Gestures**: Position your hand in front of the camera and make any of the supported gestures.
3. **View Results**: Watch the real-time visualization of your hand landmarks and see the detected gesture name displayed on screen, which updates in real-time as you change gestures.
---
##  Results

https://github.com/user-attachments/assets/904862fa-98e8-4cff-860a-3184b28e8bb6

---
##  License
This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.
