let lastRarity = null; // 上次抽卡的品质
let fourStarProbability = 0; // 四星抽卡的概率
let tenDrawResults = []; // 存储十连抽结果

function drawCard() {
    // 抽卡的随机数
    const randomNum = Math.random();

    if (lastRarity === 'SSR') {
        // 如果上次是SSR，50%概率抽到SSR或SRR
        if (randomNum < 0.5) {
            lastRarity = 'SSR';
        } else {
            lastRarity = 'SRR';
        }
    } else if (lastRarity === 'SRR') {
        // 如果上次是SRR，下次必定抽到SSR
        lastRarity = 'SSR';
    } else {
        // 普通抽卡逻辑
        if (randomNum < 0.01) {
            lastRarity = 'SSR'; // 1%概率SSR
        } else if (randomNum < 0.1) {
            lastRarity = 'SRR'; // 10%概率SRR
        } else if (randomNum < 0.3) {
            lastRarity = 'SR'; // 20%概率SR
        } else {
            lastRarity = 'R'; // 69%概率R
        }
    }

    return lastRarity;
}

function singleDraw() {
    const result = drawCard();
    displayResult([result]);
}

function tenDraw() {
    // 每次十连抽至少获得一个四星
    tenDrawResults = [];
    let fourStarDrawn = false;

    for (let i = 0; i < 10; i++) {
        const result = drawCard();
        tenDrawResults.push(result);
        
        if (result === 'SR' && !fourStarDrawn) {
            fourStarDrawn = true; // 已经抽到四星
        }
    }

    // 如果十连抽中没有四星，强制设置一个四星
    if (!fourStarDrawn) {
        const replaceIndex = Math.floor(Math.random() * 10);
        tenDrawResults[replaceIndex] = 'SR'; // 随机替换为四星
    }

    // 重置四星抽卡概率
    fourStarProbability = 0;

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
}

// 添加事件监听器
document.getElementById("singleDraw").addEventListener("click", singleDraw);
document.getElementById("tenDraw").addEventListener("click", tenDraw);