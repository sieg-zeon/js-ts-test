const { parentPort, workerData } = require('worker_threads');

// ワーカーのIDを取得
const workerId = workerData.workerId;

// 重い計算をシミュレート
function heavyComputation() {
    let result = 0;
    for (let i = 0; i < 100000000; i++) {
        result += Math.sqrt(i);
    }
    return result;
}

// メインスレッドにメッセージを送信
parentPort.postMessage(`Worker ${workerId} started`);

// 計算を実行
const result = heavyComputation();
parentPort.postMessage(`Worker ${workerId} completed computation: ${result}`);

// ワーカーを終了
parentPort.postMessage(`Worker ${workerId} is exiting`); 
