const queue = [];
let isProcessing = false;

async function processQueue() {
    if (isProcessing || queue.length === 0) return;

    isProcessing = true;
    const { req, res, next } = queue.shift();

    // next 호출과 함께 큐에서 다음 요청을 처리하지 않고, 현재 요청이 완전히 종료될 때까지 기다림
    next();
    
    // 요청 처리가 완료될 때까지 기다림 (예: res.on('finish', ...)를 통해 확인)
    res.on('finish', () => {
        isProcessing = false;
        processQueue();  // 다음 요청 처리
    });
}

function globalQueueMiddleware(req, res, next) {
    queue.push({ req, res, next });
    processQueue();
}

module.exports = globalQueueMiddleware;
