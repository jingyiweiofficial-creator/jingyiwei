document.addEventListener("DOMContentLoaded", function() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const topGroup = document.getElementById('top-group');
            const bottomGroup = document.getElementById('bottom-group');

            // 我們把所有 key 轉成陣列來處理
            const productIds = Object.keys(data);

            productIds.forEach(id => {
                const p = data[id];
                
                // 只處理「穿搭類」的商品
                if (p.category === 'apparel') {
                    const itemHTML = `
                        <a href="product.html?id=${id}" class="category-item">
                            <div class="item-card">
                                <div class="item-img-box">
                                    <img src="${p.mainImg}" alt="${p.name}">
                                </div>
                                <div class="item-info">
                                    <h3>${p.name}</h3>
                                    <p class="item-price">NT. ${p.price}</p>
                                </div>
                            </div>
                        </a>
                    `;

                    // 根據 subCategory 塞到對應的容器
                    if (p.subCategory === 'top') {
                        topGroup.innerHTML += itemHTML;
                    } else if (p.subCategory === 'bottom') {
                        bottomGroup.innerHTML += itemHTML;
                    }
                }
            });
        });
});