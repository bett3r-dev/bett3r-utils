import { EventEmitter as NativeEventEmitter } from 'events';

declare module 'events' {
    interface EventEmitter {
        on<K extends keyof any>(event: K, listener: (...args: any[]) => void): this;
        emit<K extends keyof any>(event: K, ...args: any[]): boolean;
    }
}

export class TypedEventEmitter<T> {
    private emitter = new NativeEventEmitter();

    on<K extends keyof T>(event: K, listener: (arg?: T[K]) => void): this {
        this.emitter.on(event as string, listener);
        return this;
    }

    emit<K extends keyof T>(event: K, arg?: T[K]): boolean {
        return this.emitter.emit(event as string, arg);
    }

    off<K extends keyof T>(event: K, listener: (arg?: T[K]) => void): this {
        this.emitter.off(event as string, listener);
        return this;
    }

    once<K extends keyof T>(event: K, listener: (arg?: T[K]) => void): this {
        this.emitter.once(event as string, listener);
        return this;
    }

    removeAllListeners<K extends keyof T>(event?: K): this {
        this.emitter.removeAllListeners(event as string);
        return this;
    }

    listeners<K extends keyof T>(event: K): Function[] {
        return this.emitter.listeners(event as string);
    }

    rawListeners<K extends keyof T>(event: K): Function[] {
        return this.emitter.rawListeners(event as string);
    }

    listenerCount<K extends keyof T>(event: K): number {
        return this.emitter.listenerCount(event as string);
    }

    prependListener<K extends keyof T>(event: K, listener: (arg?: T[K]) => void): this {
        this.emitter.prependListener(event as string, listener);
        return this;
    }

    prependOnceListener<K extends keyof T>(event: K, listener: (arg?: T[K]) => void): this {
        this.emitter.prependOnceListener(event as string, listener);
        return this;
    }

    eventNames(): (keyof T)[] {
        return this.emitter.eventNames() as (keyof T)[];
    }

    getMaxListeners(): number {
        return this.emitter.getMaxListeners();
    }

    setMaxListeners(n: number): this {
        this.emitter.setMaxListeners(n);
        return this;
    }
}
