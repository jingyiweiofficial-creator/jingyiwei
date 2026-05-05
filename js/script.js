// 等待網頁結構載入完成
document.addEventListener("DOMContentLoaded", function() {
    
    // 取得 Navbar 元素
    const navbar = document.getElementById("navbar");

    // 監聽視窗的滾動事件
    if (navbar) {
        window.addEventListener("scroll", function() {
            // 如果網頁往下滑動超過 50px
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

});

// ==========================================
// 理念輪播資料 (加上安全防護，只在首頁執行)
// ==========================================
const spiritData =[
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

    // 確保頁面上有這個元素才執行 (避免在商品頁報錯)
    if (imgElement && descElement) {
        imgElement.style.opacity = 0;
        setTimeout(() => {
            imgElement.src = spiritData[currentSpiritIndex].img;
            descElement.innerText = spiritData[currentSpiritIndex].text;
            imgElement.style.opacity = 1;
        }, 300);
    }
}

// 綁定按鈕點擊事件 (同樣確保按鈕存在)
const nextSpirit = document.getElementById('nextSpirit');
const prevSpirit = document.getElementById('prevSpirit');

if (nextSpirit && prevSpirit) {
    nextSpirit.addEventListener('click', () => {
        currentSpiritIndex = (currentSpiritIndex + 1) % spiritData.length;
        updateSpirit();
    });

    prevSpirit.addEventListener('click', () => {
        currentSpiritIndex = (currentSpiritIndex - 1 + spiritData.length) % spiritData.length;
        updateSpirit();
    });

    // 初始執行一次
    updateSpirit();
}


// ==========================================
// 購物車與登入系統邏輯
// ==========================================

// 模擬登入狀態
let isLoggedIn = false; 

document.addEventListener("DOMContentLoaded", function() {
    
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const checkoutBtn = document.getElementById('checkout-btn');
    const loginBtn = document.getElementById('login-btn');

    // 1. 打開與關閉購物車
    if (cartBtn && cartDrawer && cartOverlay) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartDrawer.classList.add('open');
            cartOverlay.style.display = 'block';
            renderCartItems(); // 每次打開重新繪製商品
        });
    }

    if (closeCartBtn && cartOverlay && cartDrawer) {
        const closeCart = () => {
            cartDrawer.classList.remove('open');
            cartOverlay.style.display = 'none';
        };
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
    }

    // 2. 結帳按鈕邏輯 (檢查登入狀態)
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('jingyiwei_cart')) ||[];
            if (cart.length === 0) {
                alert("購物車是空的喔！快去挑選文化鎧甲吧。");
                return;
            }

            if (isLoggedIn) {
                alert("即將跳轉至付款頁面... (期中專案展示用)");
            } else {
                alert("請先登入會員，才能進行結帳喔！");
            }
        });
    }

    // 3. 模擬登入按鈕點擊 (期中 Demo 專用)
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isLoggedIn) {
                alert("假裝我們彈出了 Google 登入視窗... 登入成功！");
                isLoggedIn = true;
                document.getElementById('user-name').innerText = "王小明";
                document.getElementById('user-name').style.color = "var(--gold-primary)";
            } else {
                alert("您已經登入囉！");
            }
        });
    }

    // 初始更新一次右上角數字
    updateCartUI();
});

// 4. 全局函數：更新購物車 UI
window.updateCartUI = function() {
    let cart = JSON.parse(localStorage.getItem('jingyiwei_cart')) ||[];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        if (cart.length > 0) {
            cartCount.style.display = 'block';
            cartCount.innerText = cart.length;
        } else {
            cartCount.style.display = 'none';
        }
    }
};

// 5. 繪製側邊欄裡的商品清單
window.renderCartItems = function() {
    let cart = JSON.parse(localStorage.getItem('jingyiwei_cart')) ||[];
    const container = document.getElementById('cart-items-container');
    const priceDisplay = document.getElementById('cart-total-price');
    
    // 如果畫面上沒有購物車區塊，直接退出 (避免報錯)
    if (!container || !priceDisplay) return; 

    container.innerHTML = ""; // 清空
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p style='color:#888; text-align:center; margin-top:20px;'>購物車空空如也</p>";
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            container.innerHTML += `
                <div class="cart-item-card">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>規格: ${item.size}</p>
                        <p style="color: var(--gold-primary);">NT. ${item.price.toLocaleString()}</p>
                    </div>
                    <button onclick="removeCartItem(${index})" style="background:none; border:none; color:#888; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
    }
    priceDisplay.innerText = total.toLocaleString(); // 加上千分位逗號
};

// 6. 刪除單個商品 (這就是剛剛被切斷那段！)
window.removeCartItem = function(index) {
    let cart = JSON.parse(localStorage.getItem('jingyiwei_cart')) || [];
    cart.splice(index, 1); // 刪除選中的那一筆
    localStorage.setItem('jingyiwei_cart', JSON.stringify(cart)); // 存回
    updateCartUI(); // 更新右上角數字
    renderCartItems(); // 重新整理側邊欄清單
};