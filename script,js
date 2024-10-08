// 初始化抽卡历史
let drawHistory = JSON.parse(localStorage.getItem('drawHistory')) || [];
let totalDraws = drawHistory.length;
let guaranteedSRDraws = 0;

// 更新抽卡记录
function updateDrawHistory() {
    const historyDiv = document.getElementById('drawHistory');
    historyDiv.innerHTML = drawHistory.join('<br>');
}

// 更新页面上显示的抽卡历史
updateDrawHistory();

// 抽卡逻辑
document.getElementById('drawBtn').addEventListener('click', function() {
    let result = Math.random();
    let cardType = '';
    totalDraws++;

    // 五星概率递增
    let fiveStarChance = (totalDraws <= 69) ? 0.01 : Math.min(1, 0.01 + (totalDraws - 69) * 0.1);

    if (result < fiveStarChance) {
        // 出现五星
        cardType = (Math.random() < 0.5) ? 'SSR' : 'SRR';
        totalDraws = 0; // 抽到五星后，重置计数
    } else if (result < 0.1 || guaranteedSRDraws >= 9) {
        // 出现四星，或每十抽保证一次四星
        cardType = '四星卡';
        guaranteedSRDraws = 0;
    } else {
        // 出现三星
        cardType = '三星卡';
        guaranteedSRDraws++;
    }

    // 记录抽卡结果
    drawHistory.push(`第 ${drawHistory.length + 1} 抽: ${cardType}`);
    localStorage.setItem('drawHistory', JSON.stringify(drawHistory));

    // 显示抽卡结果
    document.getElementById('drawResult').innerText = `你抽到了: ${cardType}`;
    updateDrawHistory();
});

// 重置抽卡历史
document.getElementById('resetBtn').addEventListener('click', function() {
    drawHistory = [];
    totalDraws = 0;
    guaranteedSRDraws = 0;
    localStorage.removeItem('drawHistory');
    updateDrawHistory();
    document.getElementById('drawResult').innerText = '';
});