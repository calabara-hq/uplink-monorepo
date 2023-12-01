import { useEffect } from 'react';

type CallbackFunction = () => void;

class TickManager {
    private subscribers: Map<symbol, CallbackFunction>;
    private interval: NodeJS.Timeout | null;

    constructor() {
        this.subscribers = new Map();
        this.interval = null;
    }

    start(): void {
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.subscribers.forEach(callback => callback());
            }, 1000);
        }
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    subscribe(id: symbol, callback: CallbackFunction): void {
        this.subscribers.set(id, callback);
        if (this.subscribers.size === 1) {
            this.start();
        }
    }

    unsubscribe(id: symbol): void {
        this.subscribers.delete(id);
        if (this.subscribers.size === 0) {
            this.stop();
        }
    }
}

const ticks = new TickManager();

export const useTicks = (callback: CallbackFunction): void => {
    useEffect(() => {
        const id = Symbol('system-tick');
        ticks.subscribe(id, callback);

        return () => {
            ticks.unsubscribe(id);
        };
    }, [callback]);
};