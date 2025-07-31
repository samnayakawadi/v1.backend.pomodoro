import notifier from 'node-notifier';
import { exec } from 'node:child_process';

// 25 minutes in milliseconds
const WORK_DURATION = 1 * 10 * 1000 // 10 seconds
const BREAK_DURATION = 1 * 10 * 1000 // 10 seconds
const LOCK_DELAY = 5 * 1000 // 2 seconds

function startPomodoroCycle() {
    console.log('🔒 Work session started. Locking screen in 25 minutes...');

    setTimeout(() => {
        // Notify for break
        notifier.notify({
            title: 'Take a Break!',
            message: '🧘 Time for a 5-minute break! Walk, drink water, or just relax. Locking Screen in 5 Seconds',
            sound: true,
            wait: false
        });

        setTimeout(() => {
            // Lock the screen (Windows only)
            exec('rundll32.exe user32.dll,LockWorkStation', (error) => {
                if (error) {
                    console.error('❌ Failed to lock the screen:', error);
                } else {
                    console.log('✅ Screen locked. Enjoy your break!');
                }

                // Start the next cycle after the break (5 minutes later)
                setTimeout(() => {
                    startPomodoroCycle();
                }, BREAK_DURATION); // 5 minutes
            });
        }, LOCK_DELAY)
    }, WORK_DURATION);
}

startPomodoroCycle();
