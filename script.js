let drawCount = 0; // 当前总的抽卡次数
let fiveStarCounter = 0; // 用于追踪五星保底计数
let fourStarCounter = 0; // 用于追踪四星保底计数
let history = []; // 保存抽卡历史
let currentPage = 1;
const recordsPerPage = 5;
let totalPages = 1;

let isGuaranteedSSR = false; // 是否处于大保底状态

// 五星卡的概率数组，前1-70抽固定1%，第71到80抽概率递增
const fiveStarRates = Array(70).fill(0.01).concat(Array(10).fill(0).map((_, i) => 0.01 + i * 0.099));

// 页面加载时，从 localStorage 恢复数据
window.onload = function() {
    const savedHistory = localStorage.getItem('history');
    const savedDrawCount = localStorage.getItem('drawCount');
    const savedFiveStarCounter = localStorage.getItem('fiveStarCounter');
    const savedFourStarCounter = localStorage.getItem('fourStarCounter');
    const savedGuaranteedSSR = localStorage.getItem('isGuaranteedSSR');

    if (savedHistory) {
        history = JSON.parse(savedHistory);
        drawCount = parseInt(savedDrawCount) || 0;
        fiveStarCounter = parseInt(savedFiveStarCounter) || 0;
        fourStarCounter = parseInt(savedFourStarCounter) || 0;
        isGuaranteedSSR = savedGuaranteedSSR === 'true';
        updatePagination();
    }
};

document.getElementById('single-draw').addEventListener('click', draw);
document.getElementById('quick-draw').addEventListener('click', quickDraw);
document.getElementById('reset').addEventListener('click', resetHistory);
document.getElementById('prev-page').addEventListener('click', prevPage);
document.getElementById('next-page').addEventListener('click', nextPage);

function draw() {
    const result = drawCard();
    displayResult(result);
    saveToLocalStorage(); // 每次抽卡后保存数据
    updatePagination();
}

function quickDraw() {
    let results = [];
    for (let i = 0; i < 10; i++) {
        const result = drawCard();
        results.push(result);
        if (fiveStarCounter === 80) break; // 快速抽卡时，如果到达第80抽，立刻出五星并停止
    }
    displayQuickDrawResults(results);
    saveToLocalStorage(); // 快速抽卡后保存数据
    updatePagination();
}

function drawCard() {
    let result = '';

    // 增加抽卡计数
    drawCount++;
    fiveStarCounter++;
    fourStarCounter++;

    // 第80抽保底五星
    if (fiveStarCounter === 80) {
        result = drawFiveStar();
        fiveStarCounter = 0; // 重置五星计数器
        fourStarCounter = 0; // 重置四星计数器
    } else {
        // 检查是否出五星卡
        if (Math.random() < fiveStarRates[fiveStarCounter - 1]) {
            result = drawFiveStar();
            fiveStarCounter = 0; // 重置五星卡计数器
            fourStarCounter = 0; // 重置四星计数器
        } else {
            // 检查是否出四星卡
            const fourStarChance = calculateFourStarChance();
            if (Math.random() < fourStarChance || fourStarCounter >= 10) {
                result = 'SR';
                fourStarCounter = 0; // 重置四星卡计数器
            } else {
                // 默认出三星卡
                result = 'R';
            }
        }
    }

    history.push(result);
    return result;
}

function drawFiveStar() {
    let result;

    // 判断是否处于大保底
    if (isGuaranteedSSR) {
        result = 'SSR';
        isGuaranteedSSR = false; // 大保底后重置为小保底
    } else {
        const isSSR = Math.random() < 0.5;
        result = isSSR ? 'SSR' : 'SRR';
        // 如果是SRR，则下次必出SSR（大保底）
        if (result === 'SRR') {
            isGuaranteedSSR = true;
        }
    }

    return result;
}

function calculateFourStarChance() {
    // 四星保底逻辑，前7抽10%，第7-10抽等差增加
    if (fourStarCounter <= 7) {
        return 0.1; // 前7抽10%概率
    } else {
        const increment = (1 - 0.1) / 3;
        return 0.1 + (increment * (fourStarCounter - 7)); // 第7-10抽
    }
}

function displayResult(result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>本次抽到: ${result}</p >`;
}

function displayQuickDrawResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h3>快速单抽十次结果:</h3>`;
    results.forEach((result, index) => {
        resultsDiv.innerHTML += `<p>第 ${index + 1} 抽: ${result}</p >`;
    });
    
    displayHistory();
}

function resetHistory() {
    history = [];
    drawCount = 0;
    fiveStarCounter = 0;
    fourStarCounter = 0;
    isGuaranteedSSR = false; // 重置大保底状态
    currentPage = 1;
    document.getElementById('results').innerHTML = '';
    document.getElementById('history').innerHTML = '';
    updatePagination();
    clearLocalStorage(); // 清除 localStorage 数据
}

function displayHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';

    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;
    const currentHistory = history.slice(start, end);

    currentHistory.forEach((record, index) => {
        historyDiv.innerHTML += `<p>${start + index + 1}. 历史记录: ${record}</p >`;
    });
}

function updatePagination() {
    totalPages = Math.ceil(history.length / recordsPerPage);

    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;

    displayHistory();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
}

// 保存抽卡记录到 localStorage
function saveToLocalStorage() {
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('drawCount', drawCount.toString());
    localStorage.setItem('fiveStarCounter', fiveStarCounter.toString());
    localStorage.setItem('fourStarCounter', fourStarCounter.toString());
    localStorage.setItem('isGuaranteedSSR', isGuaranteedSSR.toString());
}

// 清除 localStorage 中的抽卡记录
function clearLocalStorage() {
    localStorage.removeItem('history');
    localStorage.removeItem('drawCount');
    localStorage.removeItem('fiveStarCounter');
    localStorage.removeItem('fourStarCounter');
    localStorage.removeItem('isGuaranteedSSR');
}