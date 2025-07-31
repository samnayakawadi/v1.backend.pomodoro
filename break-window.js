// break-window.mjs

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { app, BrowserWindow, screen } = require('electron');

// 🎯 CHANGE THIS VALUE TO MODIFY COUNTDOWN DURATION
const BREAK_DURATION_SECONDS = 10;

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const win = new BrowserWindow({
        width,
        height,
        fullscreen: true,
        alwaysOnTop: true,
        frame: false,
        transparent: false,
        resizable: false,
        movable: false,
        minimizable: false,
        maximizable: false,
        closable: true, // Changed to true to allow closing
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Break Time</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
          }

          .background-animation {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
            z-index: -1;
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .floating-particles {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
          }

          .particle {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
            50% { transform: translateY(-100px) rotate(180deg); opacity: 0.8; }
          }

          /* Close Button Styles */
          .close-button {
            position: absolute;
            top: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            color: white;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            z-index: 1000;
            user-select: none;
          }

          .close-button:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          }

          .close-button:active {
            transform: scale(0.95);
          }

          .container {
            text-align: center;
            z-index: 10;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            padding: 60px 80px;
            border-radius: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            animation: slideIn 0.8s ease-out;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .emoji {
            font-size: 120px;
            margin-bottom: 30px;
            animation: bounce 2s ease-in-out infinite;
            display: block;
          }

          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }

          .main-title {
            font-size: 4.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            letter-spacing: -2px;
          }

          .subtitle {
            font-size: 1.8rem;
            font-weight: 400;
            margin-bottom: 40px;
            opacity: 0.9;
            line-height: 1.4;
          }

          .countdown-container {
            margin-top: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .countdown-label {
            font-size: 1.2rem;
            opacity: 0.8;
            margin-bottom: 15px;
            font-weight: 500;
          }

          .countdown {
            font-size: 4rem;
            font-weight: 700;
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
            min-width: 100px;
            animation: pulse 1s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .progress-bar {
            width: 400px;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            margin-top: 30px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ffd700, #ffed4e);
            border-radius: 3px;
            animation: progressFill ${BREAK_DURATION_SECONDS}s linear;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }

          @keyframes progressFill {
            from { width: 100%; }
            to { width: 0%; }
          }

          .tips {
            margin-top: 40px;
            display: flex;
            justify-content: center;
            gap: 60px;
            flex-wrap: wrap;
          }

          .tip {
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0.8;
            animation: fadeInUp 1s ease-out;
          }

          .tip:nth-child(2) { animation-delay: 0.2s; }
          .tip:nth-child(3) { animation-delay: 0.4s; }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 0.8;
              transform: translateY(0);
            }
          }

          .tip-icon {
            font-size: 2.5rem;
            margin-bottom: 10px;
          }

          .tip-text {
            font-size: 1.1rem;
            font-weight: 500;
          }

          .close-hint {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 1rem;
            opacity: 0.6;
            animation: fadeIn 2s ease-in;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 0.6; }
          }

          /* Skip Button */
          .skip-button {
            margin-top: 30px;
            padding: 12px 30px;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 25px;
            color: white;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            user-select: none;
          }

          .skip-button:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          }

          .skip-button:active {
            transform: translateY(0);
          }

          /* Responsive design */
          @media (max-width: 1200px) {
            .container { padding: 40px 60px; max-width: 90%; }
            .main-title { font-size: 3.5rem; }
            .subtitle { font-size: 1.5rem; }
            .countdown { font-size: 3rem; }
            .tips { gap: 40px; }
            .close-button { top: 20px; right: 20px; width: 45px; height: 45px; }
          }

          @media (max-width: 768px) {
            .container { padding: 30px 40px; }
            .main-title { font-size: 2.8rem; }
            .subtitle { font-size: 1.3rem; }
            .countdown { font-size: 2.5rem; }
            .progress-bar { width: 300px; }
            .tips { flex-direction: column; gap: 30px; }
            .close-button { top: 15px; right: 15px; width: 40px; height: 40px; font-size: 18px; }
          }
        </style>
      </head>
      <body>
        <div class="background-animation"></div>
        
        <div class="floating-particles" id="particles"></div>

        <!-- Close Button -->
        <div class="close-button" id="closeBtn" title="Close break window">
          ✕
        </div>

        <div class="container">
          <span class="emoji">🧘‍♀️</span>
          <h1 class="main-title">Time for a Break!</h1>
          <p class="subtitle">Take a moment to recharge your mind and body</p>
          
          <div class="countdown-container">
            <div class="countdown-label">Returning in</div>
            <div class="countdown" id="countdown">${BREAK_DURATION_SECONDS}</div>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>

          <div class="tips">
            <div class="tip">
              <div class="tip-icon">🚶‍♀️</div>
              <div class="tip-text">Take a walk</div>
            </div>
            <div class="tip">
              <div class="tip-icon">💧</div>
              <div class="tip-text">Stay hydrated</div>
            </div>
            <div class="tip">
              <div class="tip-icon">👀</div>
              <div class="tip-text">Rest your eyes</div>
            </div>
          </div>

          <!-- Skip Button -->
          <div class="skip-button" id="skipBtn">
            Skip Break
          </div>
        </div>

        <div class="close-hint">This window will close automatically • Press ESC or click ✕ to close</div>

        <script>
          const { ipcRenderer } = require('electron');

          // Countdown functionality using dynamic duration
          let timeLeft = ${BREAK_DURATION_SECONDS};
          const countdownElement = document.getElementById('countdown');
          
          const countdownTimer = setInterval(() => {
            timeLeft--;
            countdownElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
              clearInterval(countdownTimer);
              countdownElement.textContent = '0';
              closeWindow();
            }
          }, 1000);

          // Close window function
          function closeWindow() {
            window.close();
          }

          // Close button event listener
          document.getElementById('closeBtn').addEventListener('click', () => {
            clearInterval(countdownTimer);
            closeWindow();
          });

          // Skip button event listener
          document.getElementById('skipBtn').addEventListener('click', () => {
            clearInterval(countdownTimer);
            closeWindow();
          });

          // Create floating particles
          function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
              const particle = document.createElement('div');
              particle.className = 'particle';
              
              const size = Math.random() * 8 + 4;
              const startX = Math.random() * window.innerWidth;
              const startY = Math.random() * window.innerHeight;
              const duration = Math.random() * 4 + 4;
              const delay = Math.random() * 2;
              
              particle.style.width = size + 'px';
              particle.style.height = size + 'px';
              particle.style.left = startX + 'px';
              particle.style.top = startY + 'px';
              particle.style.animationDuration = duration + 's';
              particle.style.animationDelay = delay + 's';
              
              particlesContainer.appendChild(particle);
            }
          }

          // Initialize particles
          createParticles();

          // Prevent context menu and selection
          document.addEventListener('contextmenu', e => e.preventDefault());
          document.addEventListener('selectstart', e => e.preventDefault());
          document.addEventListener('dragstart', e => e.preventDefault());

          // Keyboard shortcuts
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              clearInterval(countdownTimer);
              closeWindow();
            }
            if (e.key === 'Enter' || e.key === ' ') {
              clearInterval(countdownTimer);
              closeWindow();
            }
          });
        </script>
      </body>
    </html>
  `));

    // Auto-close after the specified duration
    const autoCloseTimer = setTimeout(() => {
        win.close();
        app.quit();
    }, BREAK_DURATION_SECONDS * 1000);

    // Handle window events
    win.on('closed', () => {
        clearTimeout(autoCloseTimer);
        app.quit();
    });

    // Allow the window to be closed by user now
    win.on('close', (event) => {
        clearTimeout(autoCloseTimer);
        // Window can be closed normally
    });
}

app.whenReady().then(createWindow);

// Prevent multiple instances
app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
