let lastRarity = null; // 上次抽卡的品质
let totalDraws = 0; // 总抽卡次数
let tenDrawResults = []; // 存储十连抽结果

function drawCard() {
    totalDraws++;
    const randomNum = Math.random();
    let currentRarity;

    // 计算五星品质的概率
    let fiveStarProbability = totalDraws <= 69 ? 0.01 : Math.min(0.1 * (totalDraws - 69), 1);

    if (lastRarity === 'SSR') {
        // 上次是SSR，50%概率抽到SSR或SRR
        currentRarity = randomNum < 0.5 ? 'SSR' : 'SRR';
    } else if (lastRarity === 'SRR') {
        // 上次是SRR，下一次必定抽到SSR
        currentRarity = 'SSR';
    } else {
        // 普通抽卡逻辑
        if (randomNum < fiveStarProbability) {
            // 处理五星品质的抽取
            currentRarity = randomNum < fiveStarProbability * 0.5 ? 'SSR' : 'SRR';
        } else if (totalDraws <= 10) {
            // 前十抽，四星品质概率
            let fourStarProbability = (totalDraws / 10) * 0.1; // 10% 到 100%
            currentRarity = randomNum < fourStarProbability ? 'SR' : 'R';
        } else {
            // 之后的抽卡默认三星品质
            currentRarity = 'R';
        }
    }

    // 更新上次抽卡品质
    lastRarity = currentRarity;
    return currentRarity;
}

function singleDraw() {
    const result = drawCard();
    displayResult([result]);
}

function tenDraw() {
    tenDrawResults = [];

    // 十连抽至少获得一个四星
    let fourStarDrawn = false;

    for (let i = 0; i < 10; i++) {
        const result = drawCard();
        tenDrawResults.push(result);
        
        if (result === 'SR') {
            fourStarDrawn = true; // 已经抽到四星
        }
    }

    // 如果十连抽中没有四星，强制设置一个四星
    if (!fourStarDrawn) {
        const replaceIndex = Math.floor(Math.random() * 10);
        tenDrawResults[replaceIndex] = 'SR'; // 随机替换为四星
    }

    displayResult(tenDrawResults);
}

function displayResult(results) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // 清空之前的结果

    // 显示结果
    results.forEach((result, index) => {
        const resultItem = document.createElement("div");
        resultItem.textContent = `第 ${index + 1} 抽: ${result}`;
        resultDiv.appendChild(resultItem);
    });

    // 记录抽卡历史
    recordHistory(results);
}

function recordHistory(results) {
    const historyDiv = document.getElementById("history");
    results.forEach((result) => {
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        historyItem.textContent = `抽到: ${result}`;
        historyDiv.appendChild(historyItem);
    });
}

// 重置历史记录
document.getElementById("resetHistory").addEventListener("click", () => {
    lastRarity = null;
    totalDraws = 0;
    document.getElementById("result").innerHTML = "";
    document.getElementById("history").innerHTML = "";
});

// 添加事件监听器
document.getElementById("singleDraw").addEventListener("click", singleDraw);
document.getElementById("tenDraw").addEventListener("click", tenDraw);