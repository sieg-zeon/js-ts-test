import { cpus } from 'os';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const numCPUs: number = cpus().length;
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

console.log(`Number of CPU cores: ${numCPUs}`);

// CPUコア数に応じてワーカーを作成
for (let i = 0; i < numCPUs; i++) {
    const worker: Worker = new Worker(join(__dirname, 'worker.ts'), {
        workerData: { workerId: i }
    });

    worker.on('message', (message: string) => {
        console.log(`Worker ${i} received: ${message}`);
    });

    worker.on('error', (error: Error) => {
        console.error(`Worker ${i} error:`, error);
    });

    worker.on('exit', (code: number) => {
        if (code !== 0) {
            console.error(`Worker ${i} stopped with exit code ${code}`);
        }
    });
}

console.log('Main thread is running...'); 
