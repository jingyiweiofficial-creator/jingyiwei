document.addEventListener("DOMContentLoaded", function() {
    
    // 1. 取得網址上的商品 ID (例如 ?id=shirt_1)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-name').innerText = "找不到商品";
        return;
    }

    // 2. 讀取 products.json 資料庫
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const product = data[productId];

            if (product) {
                // 填入基礎文字資料
                document.getElementById('product-name').innerText = product.name;
                document.getElementById('product-desc').innerText = product.description || "暫無敘述";
                
                // 顯示價格
                const priceElement = document.getElementById('product-price');
                if (product.price === "0") {
                    priceElement.innerText = "展示品 (不對外販售)";
                } else {
                    priceElement.innerText = product.price || "未標價";
                }

                // === 處理尺寸與標題切換 ===
                const sizeList = document.getElementById('size-list');
                const selectedSizeText = document.getElementById('selected-size-text');
                const sizeTitle = document.getElementById('size-title'); // ★ 修正：這行一定要加，程式才認識 sizeTitle

                // 根據分類切換標題
                if (product.category === "apparel") {
                    sizeTitle.innerText = "服裝大小";
                } else if (product.category === "bag") {
                     sizeTitle.innerText = "包袋尺寸";
                } else if (product.category === "lifestyle") {
                    sizeTitle.innerText = "商品規格";
                } else {
                    sizeTitle.innerText = "規格尺寸";
                }

                sizeList.innerHTML = ""; // 清空舊按鈕
                if (product.sizes && product.sizes.length > 0) {
                    product.sizes.forEach((size, index) => {
                        const btn = document.createElement('button');
                        btn.className = 'size-btn';
                        btn.innerText = size;

                        if (index === 0) {
                            btn.classList.add('active');
                            selectedSizeText.innerText = size;
                        }

                        btn.addEventListener('click', function() {
                            document.querySelectorAll('.size-btn').forEach(el => el.classList.remove('active'));
                            this.classList.add('active');
                            selectedSizeText.innerText = this.innerText;
                        });
                        sizeList.appendChild(btn);
                    });
                } else {
                    selectedSizeText.innerText = "單一規格";
                }

                // 設定主圖
                const mainImage = document.getElementById('main-image');
                mainImage.src = product.mainImg;

                // 產生顏色圈圈
                const colorList = document.getElementById('color-list');
                colorList.innerHTML = ""; 
                if(product.colors){
                    product.colors.forEach(colorHex => {
                        const dot = document.createElement('div');
                        dot.className = 'color-dot';
                        dot.style.background = colorHex; 
                        colorList.appendChild(dot);
                    });
                }

                // 產生縮圖列表
                const thumbnailList = document.getElementById('thumbnail-list');
                thumbnailList.innerHTML = ""; 
                if(product.thumbnails){
                    product.thumbnails.forEach((thumbSrc, index) => {
                        const img = document.createElement('img');
                        img.src = thumbSrc;
                        if(index === 0) img.classList.add('active');
                        
                        img.addEventListener('click', function() {
                            mainImage.src = this.src;
                            document.querySelectorAll('.thumbnail-container img').forEach(el => el.classList.remove('active'));
                            this.classList.add('active');
                        });
                        thumbnailList.appendChild(img);
                    });
                }

                // === 3. 局部放大鏡功能 ===
                const zoomContainer = document.getElementById('zoom-container');
                zoomContainer.addEventListener('mousemove', function(e) {
                    const rect = zoomContainer.getBoundingClientRect();
                    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
                    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
                    mainImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
                    mainImage.style.transform = "scale(2.5)";
                });
                zoomContainer.addEventListener('mouseleave', function() {
                    mainImage.style.transformOrigin = "center center";
                    mainImage.style.transform = "scale(1)";
                });
                // ==========================================
                // ★ 新增：加入購物車功能
                // ==========================================
                const orderBtn = document.querySelector('.order-btn');
                orderBtn.addEventListener('click', function() {
                    
                    // 1. 取得使用者選的尺寸 (如果沒有尺寸就給預設)
                    const selectedSize = document.getElementById('selected-size-text').innerText;
                    
                    // 2. 確保商品有價格才能買 (非賣品阻擋)
                    if (product.price === "0" || product.price === "非賣品") {
                        alert("此為展示品，無法訂購喔！");
                        return;
                    }

                    // 3. 建立這個商品的資料包
                    const itemToBuy = {
                        id: productId,
                        name: product.name,
                        size: selectedSize,
                        price: parseInt(product.price.replace(',', '')), // 把 1,280 變成數字 1280
                        img: product.mainImg
                    };

                    // 4. 從 localStorage 拿出舊的購物車 (如果沒有就建立空陣列)
                    let cart = JSON.parse(localStorage.getItem('jingyiwei_cart')) ||[];
                    
                    // 5. 把新商品塞進去並存回瀏覽器
                    cart.push(itemToBuy);
                    localStorage.setItem('jingyiwei_cart', JSON.stringify(cart));

                    alert(`已將 ${product.name} (${selectedSize}) 加入購物車！`);
                    
                    // 呼叫更新購物車數字的函數 (寫在 script.js)
                    updateCartUI(); 
                });

            } else {
                
                document.getElementById('product-name').innerText = "商品不存在";
            }
        })
        .catch(error => {
            console.error("載入錯誤:", error);
            document.getElementById('product-name').innerText = "資料載入發生錯誤";
        });
});