const numCPUs = require('os').cpus().length;
const { Worker } = require('worker_threads');

console.log(`Number of CPU cores: ${numCPUs}`);

// CPUコア数に応じてワーカーを作成
for (let i = 0; i < numCPUs; i++) {
    const worker = new Worker('./worker.js', {
        workerData: { workerId: i }
    });

    worker.on('message', (message) => {
        console.log(`Worker ${i} received: ${message}`);
    });

    worker.on('error', (error) => {
        console.error(`Worker ${i} error:`, error);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker ${i} stopped with exit code ${code}`);
        }
    });
}

console.log('Main thread is running...'); 