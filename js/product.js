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

            } else {
                document.getElementById('product-name').innerText = "商品不存在";
            }
        })
        .catch(error => {
            console.error("載入錯誤:", error);
            document.getElementById('product-name').innerText = "資料載入發生錯誤";
        });
});