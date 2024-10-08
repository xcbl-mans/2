// 定义卡片及其稀有度
const cards = [
    { name: '三星', rarity: 'R' },  // 普通卡片
    { name: '四星', rarity: 'SR' }, // 四星卡片
    { name: '歪了', rarity: 'SRR' }, // 超稀有五星卡片
    { name: 'up', rarity: 'SSR' }  // 超超级稀有五星卡片
];

// 用于存储抽卡状态
let nextGuaranteedSSR = false;          // 控制是否下次必出SSR
let nextGuaranteedSRRorSSR = false;     // 控制下次出SSR或SRR（50%几率）
let currentSRProbability = 0.05;        // 当前四星（SR）概率，初始为5%
const maxSRProbability = 0.3;           // 四星卡片最大概率（30%）
const SRIncrement = 0.05;               // 每次不出四星时增加的概率

// 抽卡函数
function drawCard() {
    // 如果下次必出SSR
    if (nextGuaranteedSSR) {
        nextGuaranteedSSR = false; // 重置标记
        return cards.find(card => card.rarity === 'SSR');
    }

    // 如果下次出SSR或SRR（50%几率）
    if (nextGuaranteedSRRorSSR) {
        nextGuaranteedSRRorSSR = false; // 重置标记
        return Math.random() < 0.5
            ? cards.find(card => card.rarity === 'SSR')
            : cards.find(card => card.rarity === 'SRR');
    }

    // 随机抽卡逻辑
    const randomValue = Math.random();

    // 判断是否抽到四星卡片
    if (randomValue < currentSRProbability) {
        currentSRProbability = 0.05; // 抽到四星后重置概率
        return cards.find(card => card.rarity === 'SR');
    }

    // 如果没有抽到四星，增加四星概率，但不能超过最大值
    currentSRProbability = Math.min(currentSRProbability + SRIncrement, maxSRProbability);

    // 如果没有抽到四星，继续抽剩下的卡片
    const randomIndex = Math.floor(Math.random() * cards.length);
    const drawnCard = cards[randomIndex];

    // 如果抽到SRR，下一次必出SSR
    if (drawnCard.rarity === 'SRR') {
        nextGuaranteedSSR = true;
    }

    // 如果抽到SSR，下一次50%几率出SSR或SRR
    if (drawnCard.rarity === 'SSR') {
        nextGuaranteedSRRorSSR = true;
    }

    return drawnCard;
}

// 显示单次抽卡结果
document.getElementById('draw-one-btn').addEventListener('click', function() {
    const result = drawCard();
    document.getElementById('result').textContent = `你抽到了: ${result.name} (${result.rarity})`;
});

// 显示十连抽结果（至少保底一张四星）
document.getElementById('draw-ten-btn').addEventListener('click', function() {
    let results = [];
    let hasSR = false; // 检查是否已经抽到四星

    for (let i = 0; i < 10; i++) {
        const card = drawCard();
        results.push(`${card.name} (${card.rarity})`);
        if (card.rarity === 'SR') {
            hasSR = true; // 如果抽到了四星
        }
    }

    // 如果十连中没有出四星，强制保底一张四星
    if (!hasSR) {
        const srCard = cards.find(card => card.rarity === 'SR');
        results[results.length - 1] = `${srCard.name} (${srCard.rarity})`; // 替换最后一张卡片为四星
        currentSRProbability = 0.05; // 重置四星概率
    }

    document.getElementById('result').textContent = `你抽到了: ${results.join(', ')}`;
});