import {
    Worker,
    isMainThread,
    parentPort
} from 'worker_threads';

import lint from './lint';


if (isMainThread) {
    let worker: Worker | null = null;
    let timer: NodeJS.Timeout;

    const destroyWorker = () => {
        worker?.terminate();
        worker = null;
    };
    const pendingMap = new Map();

    const initWorker = () => {
        worker = new Worker(__filename);
        worker.on('message', ({ resourcePath, result }) => {
            if (pendingMap.has(resourcePath)) {
                const resolve = pendingMap.get(resourcePath);
                pendingMap.delete(resourcePath);
                resolve(result);
            }

            // 设置600毫秒注销, 对于大部分编译场景来说，只有最后检查完才会注销
            if (!pendingMap.size) {
                /* eslint-disable-next-line @typescript-eslint/no-magic-numbers */
                timer = setTimeout(destroyWorker, 600);
            }
        });
    };

    module.exports = async (resourcePath: string, cwd: string) => {
        if (!worker) {
            initWorker();
        }
        worker!.postMessage({ resourcePath, cwd });
        clearTimeout(timer);

        return new Promise(resolve => {
            pendingMap.set(resourcePath, resolve);
        });
    };
}
else {
    parentPort!.on('message', workerData => {
        const { resourcePath, cwd } = workerData;
        lint(resourcePath, cwd).then(result => {
            workerData.result = result;
            parentPort!.postMessage(workerData);
        });
    });
}

