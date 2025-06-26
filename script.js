const cartContentsArr = new Array();
const goodsArray = [
    ["meswak.webp", "meswak", 50, 1],
    ["misb7a.jpg", "misb7a", 60, 1],
    ["quran2.webp", "quran", 0, 1],
    ["DISH.jpeg", "dishdasha", 24, 1],
    ["black.jpeg", "dishdasha black", 9, 1],
    ["mm.jpeg", "misb7a elctonic", 5, 1],
    ["katem.jpeg", "katem", 30, 1],
    ["dsas.jpeg", "3bayaa", 10, 1],
    ["pizza.png!f305cw", "pizaa", 20, 1],
];

const cartContent = document.getElementById("cartContents");
const purchaseButtons = document.querySelectorAll(".purchaseButton");
const ClearCart = document.getElementById("clearcart");
const TotalSalary = document.getElementById("salary");
const itemsCount = document.getElementById("items");
const darklight = document.getElementById("moonIcon");
const our = document.getElementById("our");

let dark = false;

window.addEventListener("DOMContentLoaded", () => {
    const savedCart = JSON.parse(localStorage.getItem("cartContentsArr"));
    if (savedCart && Array.isArray(savedCart)) {
        cartContentsArr.push(...savedCart);
        savedCart.forEach(item => {
            const index = goodsArray.findIndex(good => good[1] === item.name);
            if (index !== -1) {
                const purchaseDiv = NewPurchase(goodsArray, index);
                purchaseDiv.querySelectorAll("h6")[1].textContent = item.count;
                cartContent.appendChild(purchaseDiv);
            }
        });
        updateItemsCount();
        addTotal();
    }

    const savedDark = localStorage.getItem("darkMode");
    if (savedDark === "true") {
        document.body.style.backgroundColor = "black";
        darklight.classList.remove("fa-moon");
        darklight.classList.add("fa-sun");
        our.style.color = "#fffffe"; // فاتح للوضع الداكن
        dark = true;
    } else {
        document.body.style.backgroundColor = "#f7f7f9";
        darklight.classList.remove("fa-sun");
        darklight.classList.add("fa-moon");
        our.style.color = "#010101"; // أسود للوضع الفاتح
        dark = false;
    }
});

darklight.addEventListener("click", () => {
    if (!dark) {
        document.body.style.backgroundColor = "black";
        darklight.classList.remove("fa-moon");
        darklight.classList.add("fa-sun");
        our.style.color = "#fffffe"; // دارك
    } else {
        document.body.style.backgroundColor = "#f7f7f9";
        darklight.classList.remove("fa-sun");
        darklight.classList.add("fa-moon");
        our.style.color = "#010101"; // لايت
    }
    dark = !dark;
    localStorage.setItem("darkMode", dark);
});

ClearCart.addEventListener("click", () => {
    while (cartContent.firstChild) {
        cartContent.removeChild(cartContent.firstChild);
    }
    cartContentsArr.length = 0;
    TotalSalary.textContent = "0";
    itemsCount.textContent = `0 items`;
    localStorage.removeItem("cartContentsArr");
});

function updateItemsCount() {
    const cartItems = cartContent.querySelectorAll(".inCart");
    let totalCount = 0;
    cartItems.forEach(item => {
        const quantity = parseInt(item.querySelectorAll("h6")[1].textContent);
        totalCount += quantity;
    });
    itemsCount.textContent = `${totalCount} item${totalCount !== 1 ? 's' : ''}`;
}

function saveCartToLocalStorage() {
    const items = [];
    const cartItems = cartContent.querySelectorAll(".inCart");
    cartItems.forEach(item => {
        const name = item.querySelector("h4").textContent;
        const price = parseFloat(item.querySelector("h6").textContent);
        const count = parseInt(item.querySelectorAll("h6")[1].textContent);
        const img = item.querySelector("img").getAttribute("src");
        items.push({ name, price, count, img });
    });
    localStorage.setItem("cartContentsArr", JSON.stringify(items));
}

function NewPurchase(arr, i) {
    const newPurchase = document.createElement("div");
    newPurchase.className = "inCart";

    const img = document.createElement("img");
    img.src = arr[i][0];
    img.style.width = "25px";
    img.style.height = "25px";

    const h4 = document.createElement("h4");
    h4.textContent = arr[i][1];
    h4.style.width = "55px";

    const price = document.createElement("h6");
    price.textContent = arr[i][2];
    price.style.width = "30px";

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.style.width = "25px";
    minusBtn.style.height = "25px";

    const quantity = document.createElement("h6");
    quantity.textContent = "1";

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.style.height = "25px";
    plusBtn.style.width = "25px";

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.style.height = "25px";
    deleteBtn.style.width = "25px";

    plusBtn.addEventListener("click", () => {
        let currentQty = parseInt(quantity.textContent);
        quantity.textContent = currentQty + 1;
        addTotal();
        updateItemsCount();
        saveCartToLocalStorage();
    });

    minusBtn.addEventListener("click", () => {
        let currentQty = parseInt(quantity.textContent);
        if (currentQty > 1) {
            quantity.textContent = currentQty - 1;
        }
        addTotal();
        updateItemsCount();
        saveCartToLocalStorage();
    });

    deleteBtn.addEventListener("click", () => {
        cartContent.removeChild(newPurchase);
        updateItemsCount();
        addTotal();
        saveCartToLocalStorage();
    });

    newPurchase.append(img, h4, price, minusBtn, quantity, plusBtn, deleteBtn);
    return newPurchase;
}

for (let i = 0; i < purchaseButtons.length; i++) {
    purchaseButtons[i].addEventListener("click", function () {
        cartContentsArr.push({
            name: goodsArray[i][1],
            price: parseFloat(goodsArray[i][2]),
            img: goodsArray[i][0],
            count: 1
        });

        cartContent.appendChild(NewPurchase(goodsArray, i));
        updateItemsCount();
        addTotal();
        saveCartToLocalStorage();
    });
}

function addTotal() {
    let total = 0;
    const cartItems = cartContent.querySelectorAll(".inCart");
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector("h6").textContent);
        const quantity = parseInt(item.querySelectorAll("h6")[1].textContent);
        total += price * quantity;
    });
    TotalSalary.textContent = total + "$";
}
