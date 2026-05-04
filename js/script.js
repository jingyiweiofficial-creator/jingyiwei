// 等待網頁結構載入完成
document.addEventListener("DOMContentLoaded", function() {
    
    // 取得 Navbar 元素
    const navbar = document.getElementById("navbar");

    // 監聽視窗的滾動事件
    window.addEventListener("scroll", function() {
        // 如果網頁往下滑動超過 50px
        if (window.scrollY > 50) {
            // 就幫 Navbar 加上 'scrolled' 這個 class (對應 css 的設定)
            navbar.classList.add("scrolled");
        } else {
            // 如果滾回最上面，就把 class 移除
            navbar.classList.remove("scrolled");
        }
    });

});
// 理念輪播資料
const spiritData = [
    {
        img: "./img/spirit1.png",
        text: "守護著「水井村的鑿井歷史」。我們挖掘在地故事，將那份刻苦耐勞、為生命開拓水源的韌性，轉化為服裝上的符號。"
    },
    {
        img: "./img/spirit2.png",
        text: "守護著「每一塊布料的生命」。堅持零廢棄原則，將舊衣與剩料解構再造，讓被遺忘的物件重新成為文化的鎧甲。"
    },
    {
        img: "./img/spirit3.png",
        text: "守護著「在地長輩的職人工藝」。我們培訓水井村的長輩負責縫紉，讓歲月累積的指尖溫度，溫暖每一位穿上井衣衛的人。"
    }
];

let currentSpiritIndex = 0;

function updateSpirit() {
    const imgElement = document.getElementById('spiritImg');
    const descElement = document.getElementById('spiritDesc');

    // 簡單的淡出淡入效果
    imgElement.style.opacity = 0;
    
    setTimeout(() => {
        imgElement.src = spiritData[currentSpiritIndex].img;
        descElement.innerText = spiritData[currentSpiritIndex].text;
        imgElement.style.opacity = 1;
    }, 300);
}

// 綁定按鈕點擊事件
document.getElementById('nextSpirit').addEventListener('click', () => {
    currentSpiritIndex = (currentSpiritIndex + 1) % spiritData.length;
    updateSpirit();
});

document.getElementById('prevSpirit').addEventListener('click', () => {
    currentSpiritIndex = (currentSpiritIndex - 1 + spiritData.length) % spiritData.length;
    updateSpirit();
});

// 初始執行一次
updateSpirit();