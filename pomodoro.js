import { exec, spawn } from 'node:child_process';
import axios from 'axios';

// const WORK_DURATION = 25 * 60 * 1000; // 25 minutes
// const BREAK_DURATION = 5 * 60 * 1000; // 5 minutes
// const LOCK_DELAY = 5 * 1000; // 5 seconds

const WORK_DURATION = 15 * 10 * 1000; // 10 seconds for testing
const BREAK_DURATION = 5 * 10 * 1000; // 10 seconds for testing
const LOCK_DELAY = 10 * 1000; // 10 seconds

const NTFY_TOPIC = 'ntfy.sh/samnayakawadi_pomodoro';

async function sendNotification(title, message, tags = '', priority = 'default') {
    try {
        const response = await axios.post(`https://${NTFY_TOPIC}`, message, {
            headers: {
                'Title': title,
                'Tags': tags,
                'Priority': priority,
                'Content-Type': 'text/plain; charset=utf-8'
            }
        });

        if (response.status === 200) {
            console.log(`📱 Notification sent: ${title}`);
        } else {
            console.error('❌ Failed to send notification:', response.statusText);
        }
    } catch (error) {
        console.error('❌ Error sending notification:', error.message);
    }
}

function startPomodoroCycle() {
    console.log('🔒 Work session started. Locking screen in 10 seconds...');

    setTimeout(async () => {
        console.log('🧘 Break time! Launching full-screen reminder...');

        // Send "Break Started" notification
        await sendNotification(
            'Break Started',  // Removed emoji from header
            '🧘 Time for a 10-second break! Step away from your screen and relax.',
            'coffee,break',
            'high'
        );

        // Launch Electron window
        const electronProcess = spawn('npx', ['electron', './break-window.js'], {
            shell: true,
            stdio: 'inherit'
        });

        // Wait 10 seconds, then lock the screen
        setTimeout(() => {
            exec('rundll32.exe user32.dll,LockWorkStation', (error) => {
                if (error) {
                    console.error('❌ Failed to lock the screen:', error);
                } else {
                    console.log('✅ Screen locked. Enjoy your break!');
                }

                // Wait for break duration before restarting the cycle
                setTimeout(async () => {
                    // Send "Break Ended" notification
                    await sendNotification(
                        'Break Ended',  // Removed emoji from header
                        '💪 Break time is over! Ready to start your next work session?',
                        'work,focus',
                        'high'
                    );

                    console.log('🔄 Starting next Pomodoro cycle...');
                    startPomodoroCycle();
                }, BREAK_DURATION);
            });
        }, LOCK_DELAY);

    }, WORK_DURATION);
}

startPomodoroCycle();
