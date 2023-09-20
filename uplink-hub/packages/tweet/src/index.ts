import { tweet } from './manageQueue.js';
import cron from 'node-cron';

const EVERY_1_SECOND = '*/1 * * * * *';
const EVERY_10_SECONDS = '*/10 * * * * *';
const EVERY_30_SECONDS = '*/30 * * * * *';
const EVERY_MINUTE = '*/1 * * * *';
const EVERY_5_MINUTES = '*/5 * * * *';
const EVERY_HOUR = '0 0 * * * *';

let isRunning = false;

const task = async () => {
    if (isRunning) {
        console.log("Previous task still running. Skipping...");
        return;
    }

    isRunning = true;
    try {
        console.log('starting task');
        await tweet();
    } catch (error) {
        console.error("Error in task:", error);
    } finally {
        isRunning = false;
    }
};

cron.schedule(EVERY_5_MINUTES, task);


