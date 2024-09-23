declare module 'fast-speedtest-api' {
    interface FastSpeedTestOptions {
        token: string;
        verbose?: boolean;
        timeout?: number;
        https?: boolean;
        urlCount?: number;
        bufferSize?: number;
    }

    interface SpeedTestResult {
        downloadSpeed: number;
    }

    class FastSpeedtest {
        constructor(options: FastSpeedTestOptions);
        getSpeed(): Promise<SpeedTestResult>;
    }

    export = FastSpeedtest;
}
