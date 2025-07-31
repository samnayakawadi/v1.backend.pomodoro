import { exec, spawn } from 'node:child_process';

// const WORK_DURATION = 25 * 60 * 1000; // 25 minutes
// const BREAK_DURATION = 5 * 60 * 1000; // 5 minutes
// const LOCK_DELAY = 5 * 1000; // 5 seconds

const WORK_DURATION = 1 * 10 * 1000; // 25 minutes
const BREAK_DURATION = 1 * 10 * 1000; // 5 minutes
const LOCK_DELAY = 10 * 1000; // 10 seconds

function startPomodoroCycle() {
    console.log('🔒 Work session started. Locking screen in 25 minutes...');

    setTimeout(() => {
        console.log('🧘 Break time! Launching full-screen reminder...');

        // Launch Electron window
        const electronProcess = spawn('npx', ['electron', './break-window.js'], {
            shell: true,
            stdio: 'inherit'
        });

        // Wait 5 seconds, then lock the screen
        setTimeout(() => {
            exec('rundll32.exe user32.dll,LockWorkStation', (error) => {
                if (error) {
                    console.error('❌ Failed to lock the screen:', error);
                } else {
                    console.log('✅ Screen locked. Enjoy your break!');
                }

                // Wait 5 minutes before restarting the cycle
                setTimeout(() => {
                    startPomodoroCycle();
                }, BREAK_DURATION);
            });
        }, LOCK_DELAY);

    }, WORK_DURATION);
}

startPomodoroCycle();
