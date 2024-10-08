let currentDraw = 1; // 当前抽卡次数
let lastRarity = null; // 上次抽卡的品质
let tenDrawResults = []; // 存储十连抽结果

function drawCard() {
    // 抽卡的随机数
    const randomNum = Math.random();
    let starFiveProbability = 0.01; // 初始五星品质概率

    // 计算当前抽卡的五星品质概率
    if (currentDraw >= 70 && currentDraw <= 80) {
        starFiveProbability = (currentDraw - 69) * 0.1; // 从第70抽到第80抽的等差增加
    }

    let currentRarity;

    // 抽取五星品质
    if (currentDraw > 69) {
        // 如果是第70抽到第80抽，使用更新后的五星概率
        if (randomNum < starFiveProbability) {
            currentRarity = (Math.random() < 0.5) ? 'SSR' : 'SRR'; // 50%概率出SSR或SRR
        } else {
            currentRarity = drawNormalRarity(randomNum);
        }
    } else {
        // 之前的逻辑，前69抽
        if (randomNum < 0.01) {
            currentRarity = (Math.random() < 0.5) ? 'SSR' : 'SRR'; // 1%概率出SSR或SRR
        } else {
            currentRarity = drawNormalRarity(randomNum);
        }
    }

    lastRarity = currentRarity; // 更新上次抽卡品质
    currentDraw++; // 增加抽卡次数
    return currentRarity;
}

function drawNormalRarity(randomNum) {
    if (randomNum < 0.1) {
        return 'SR'; // 10%概率SR
    } else {
        return 'R'; // 90%概率R
    }
}

function singleDraw() {
    const result = drawCard();
    displayResult([result]);
}

function tenDraw() {
    tenDrawResults = [];

    // 进行十连抽
    for (let i = 0; i < 10; i++) {
        tenDrawResults.push(drawCard());
    }

    displayResult(tenDrawResults);
}

// 更新显示结果
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