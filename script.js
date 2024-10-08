let lastRarity = null; // 上次抽卡的品质
let drawHistory = []; // 抽卡记录
let drawCount = 0; // 记录总抽卡次数

function drawCard() {
    // 抽卡的随机数
    const randomNum = Math.random();
    drawCount++; // 增加抽卡次数

    // 抽取五星品质的概率计算
    let starFiveProbability = 0.01; // 初始概率1%

    if (drawCount >= 70) {
        starFiveProbability = Math.min(1, 0.01 + ((drawCount - 70) * 0.1));
    }

    // 处理品质
    if (lastRarity === 'SSR') {
        // 如果上次是SSR，50%概率抽到SSR或SRR
        lastRarity = (randomNum < 0.5) ? 'SSR' : 'SRR';
    } else if (lastRarity === 'SRR') {
        // 如果上次是SRR，下次必定抽到SSR
        lastRarity = 'SSR';
    } else {
        // 普通抽卡逻辑
        if (randomNum < starFiveProbability) {
            lastRarity = (Math.random() < 0.5) ? 'SSR' : 'SRR'; // 50%概率选择SSR或SRR
        } else if (randomNum < 0.3) {
            lastRarity = 'SR'; // 20%概率SR
        } else {
            lastRarity = 'R'; // 69%概率R
        }
    }

    // 每十抽至少出一个四星品质的SR
    if (drawCount % 10 === 0) {
        lastRarity = 'SR';
    }

    drawHistory.push(lastRarity); // 记录抽卡结果
    return lastRarity;
}

function singleDraw() {
    const result = drawCard();
    displayResult([result]);
    updateHistory(result);
}

function tenDraw() {
    let tenDrawResults = [];

    for (let i = 0; i < 10; i++) {
        const result = drawCard();
        tenDrawResults.push(result);
    }

    displayResult(tenDrawResults);
    tenDrawResults.forEach(updateHistory); // 更新历史记录
}

function displayResult(results) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // 清空之前的结果

    results.forEach((result, index) => {
        const resultItem = document.createElement("div");
        resultItem.textContent = `第 ${index + 1} 抽: ${result}`;
        resultDiv.appendChild(resultItem);
    });
}

function updateHistory(result) {
    const historyDiv = document.getElementById("history");
    const historyItem = document.createElement("div");
    historyItem.textContent = `抽卡记录: ${result}`;
    historyDiv.appendChild(historyItem);
}

// 重置抽卡记录
document.getElementById("resetHistory").addEventListener("click", () => {
    drawHistory = [];
    drawCount = 0;
    document.getElementById("history").innerHTML = ""; // 清空历史记录
});

// 添加事件监听器
document.getElementById("singleDraw").addEventListener("click", singleDraw);
document.getElementById("tenDraw").addEventListener("click", tenDraw);