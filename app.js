// Register Function
function registerUser() {
    const email = document.querySelector('.registerEmail')?.value.trim();
    const password = document.querySelector('.registerPasword')?.value;
    const name = document.querySelector('.registerUserName')?.value.trim();
    const registerUserImg=document.querySelector('.registerUserImg');
    const file = registerUserImg?.files[0];

    if (!email || !password || !name || !file) {
        alert("Please fill out all fields.");
        return;
    }
    

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Img = e.target.result;
        
        localStorage.setItem('registeredEmail', email);
        localStorage.setItem('registeredPassword', password);
        localStorage.setItem('registeredUserName', name);
        localStorage.setItem('registerUserImg', base64Img);
        alert("Registration successful!");
        window.location.href = "./login.html";
    };
    reader.readAsDataURL(file);
}

// Login Function
function loginFun() {
    const userEmail = document.querySelector('.userEmail')?.value.trim();
    const userPassword = document.querySelector('.userPassword')?.value;

    const savedEmail = localStorage.getItem('registeredEmail');
    const savedPassword = localStorage.getItem('registeredPassword');
    const savedName = localStorage.getItem('registeredUserName');
    const savedImg=localStorage.getItem('registerUserImg');

    if (!userEmail || !userPassword) {
        alert("Please enter both email and password.");
        return;
    }

    if (userEmail === savedEmail && userPassword === savedPassword) {
        alert("Login successful!");
        localStorage.setItem('isLoggedIn', 'true');
        window.open("./index.html");
        window.remove("./logIn.html");
        // window.location.href = "/index.html";



    } else {
        alert("Invalid email or password.");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const name = localStorage.getItem('registeredUserName');
    const img=localStorage.getItem('registerUserImg');
    const profileName = document.querySelector('.profileName');
    const exitLogin = document.querySelector('.exitLogin');
    const loginImg=document.querySelector('.loginImg');

    if (isLoggedIn === 'true' && name && img && profileName && exitLogin) {
        profileName.textContent = name;
        exitLogin.innerHTML = "Logout";
        loginImg.innerHTML = `<img src="${img}" alt="User Image" class="h-full w-full rounded-full " />`;

       
    }
    exitLogin.addEventListener("click", logoutUser);
});

function logoutUser() {
    localStorage.clear();
    // window.open("/index.html"); 
    // window.location.href = "/index.html";
}
/*============================================ LOGIN/LOGOUT END =============================*/


function toggleMenu() {
    const menu = document.querySelector('.mobileMenu');
    menu.classList.toggle('hidden');
}


const hideCard=document.querySelector('.hideCard');
const main=document.querySelector('.main');
const CardheroContainer=document.querySelector('.CardheroContainer');
const recipesDetails = document.querySelector('.recipeContainer');
let recipes = [];

async function getAllmeals() {
    recipesDetails.innerHTML = `<h1 class="text-black text-center mt-6 text-2xl">Loading....</h1>`;
    try {
        const response = await fetch('https://dummyjson.com/recipes');
        const data = await response.json();
        recipes = data.recipes;

        recipesDetails.innerHTML = "";
        recipes.forEach((element, index) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <div class="img flex">
                    <img src="${element.image}" alt="${element.name}" class="w-32 h-32 object-cover"/>
                    <div class="name ml-4">
                        <h1 class="text-2xl font-bold">${element.name}</h1>
                        <h3 class="text-xl mt-4">MealType: ${element.mealType}</h3>
                        <h3 class="text-xl mt-4">Rating: ${element.rating}</h3>
                        <div class="flex gap-2 mt-10">
                            <span class="px-2 py-1 rounded bg-green-100 text-green-600 text-sm">Vegetarian</span>
                            <span class="px-2 py-1 rounded bg-orange-100 text-orange-600 text-sm">🌶️Medium</span>
                        </div>
                    </div>
                </div>
                <div class="price mt-3 flex flex-col gap-20 items-center justify-between">
                    <h1 class="text-orange-500 text-xl font-bold">₹${element.caloriesPerServing}</h1>
                    <button onclick="addToCart(${index})"
                        class="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded">
                        Add to Cart
                    </button>
                </div>
            `;
            recipesDetails.appendChild(recipeDiv);
        });

    } catch (error) {
        console.error("Error loading meals:", error);
    }
}

function addToCart(id) {
    const recipe = recipes[id];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item.id === recipe.id);

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...recipe, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}

getAllmeals();


function renderCart() {
    const cardPart1 = document.querySelector('.cardPart1');
    const cardPart2 = document.querySelector('.cardPart2');
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Reset
    cardPart1.innerHTML = `<h1 class="text-2xl text-black m-5 font-semibold">Your Card</h1>`;
    cardPart2.innerHTML = `<h2 class="text-lg font-semibold text-gray-700 mb-4">PRICE DETAILS</h2>`;

    if (cart.length === 0) {
        hideCard.classList.add('hidden');
        CardheroContainer.classList.remove('hidden');
        return;
    } else {
        hideCard.classList.remove('hidden');
        CardheroContainer.classList.add('hidden');
    }

    let totalMRP = 0;
    let totalDiscount = 0;
    let platformFee = 3;
    let totalItems = 0;

    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        totalItems += quantity;

        const originalPrice = item.caloriesPerServing / 0.65;
        const discount = originalPrice - item.caloriesPerServing;

        totalMRP += originalPrice * quantity;
        totalDiscount += discount * quantity;

        const div = document.createElement('div');
        div.className = 'cardItems text-black flex gap-3 mb-3';

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="object-cover rounded w-24 h-24"/>
            <div class="flex flex-col">
                <span class="text-xl font-semibold">${item.name}</span>
                <span class="text-sm text-gray-500 mt-2">Size: XL</span>
                <span class="text-sm text-gray-500 mt-2">Seller: maniaclife</span>
                <h1 class="text-black text-xl font-bold mt-2">₹${item.caloriesPerServing} 
                    <del class="ml-3 text-sm text-[#625e5e]">₹${originalPrice.toFixed(2)}</del>
                    <span class="ml-3 text-sm text-green-600">65% Off</span>
                </h1>
                <div class="flex gap-5 mt-5">
                    <div class="decrease w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xl cursor-pointer">-</div>
                    <div class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md">${quantity}</div>
                    <div class="increase w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xl cursor-pointer">+</div>
                    <button onclick="removeFromCart(${index})" class="text-blue-600 font-medium ml-4 cursor-pointer">Remove</button>
                </div>
            </div>
        `;

        cardPart1.appendChild(div);

        const increaseBtn = div.querySelector('.increase');
        const decreaseBtn = div.querySelector('.decrease');
        const removeBtn = div.querySelector('.remove');

        increaseBtn.addEventListener('click', () => {
           cart[index].quantity += 1;
           localStorage.setItem('cart', JSON.stringify(cart));
           renderCart();
        });

       decreaseBtn.addEventListener('click', () => {
           if (cart[index].quantity > 1) {
               cart[index].quantity -= 1;
            } else {
               cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        });


    });

    const totalAmount = totalMRP - totalDiscount + platformFee;

    const summary = document.createElement('div');
    summary.innerHTML = `
      <div class="flex justify-between text-[#000]">
        <span>Price (${totalItems} item${totalItems > 1 ? 's' : ''})</span>
        <span>₹${totalMRP.toFixed(2)}</span>
      </div>
      <div class="flex justify-between mt-3 text-[#000]">
        <span>Discount</span>
        <span class="text-green-600">-₹${totalDiscount.toFixed(2)}</span>
      </div>
      <div class="flex justify-between mt-3 text-[#000]">
        <span>Platform Fee</span>
        <span>₹${platformFee}</span>
      </div>
      <div class="flex justify-between mt-3 text-[#000]">
        <span>Delivery Charges</span>
        <span class="text-green-600">FREE</span>
      </div>
      <hr class="mt-3 text-[#9d9999]"/>
      <div class="flex justify-between mt-3 font-bold text-lg text-[#000]">
        <span>Total</span>
        <span>₹${totalAmount.toFixed(2)}</span>
      </div>
      <button class="cursor-pointer w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300">PLACE ORDER</button>
      <div class="mt-4 text-gray-500 text-sm flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2zm9-5h-3v2h3v-2zm0 4h-3v2h3v-2zm0 4h-3v2h3v-2zM3 8h3v2H3V8zm0 4h3v2H3v-2zm0 4h3v2H3v-2z"></path>
        </svg>
        Safe and Secure Payments. Easy returns. 100% Authentic products.
      </div>
    `;

    cardPart2.appendChild(summary);
}


window.onload = function() {
    renderCart();
}


function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Remove item by index
    cart.splice(index, 1);

    // Update localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Re-render cart
    renderCart();
}










