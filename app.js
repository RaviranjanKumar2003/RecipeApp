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
const child2=document.querySelector('.child2');
const CardheroContainer=document.querySelector('.CardheroContainer');
const recipesDetails = document.querySelector('.recipeContainer');
let recipes = [];

async function getAllmeals() {
    recipesDetails.innerHTML = `<h1 class="mt-6 text-2xl">Loading....</h1>`;
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
    // Get cart from localStorage (or empty array if none)
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    child2.innerHTML = ''; // Clear any previous items
    if (cart.length === 0) {
        hideCard.classList.add('hidden'); // Hide cart section
        // CardheroContainer.classList.remove('hidden');
        CardheroContainer.innerHTML=`
         <div class="child2 flex flex-col text-center">
               <div class=" cardDiv h-[250px] w-[250px] flex justify-center items-center rounded-full bg-[#f9be53]">
                   <img src="./img/card.svg" class="h-[160px]">
                    <!-- <img src="./img/sad-face.png" class="z-200"> -->
               </div>
               <h1 class="text-center text-gray-600 text-lg sm:text-xl font-semibold mt-4">Your cart is empty.</h1>
               <a href="./menu.html" class="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300">Explore the Menu</a>
           </div>
        `;
    }
    else{
      CardheroContainer.classList.add('hidden');
    }
    

    if (cart.length === 0) {
        cardPart1.innerHTML = `<p>Your cart is empty.</p>`;
        return;
    }

    // For each item in cart, create a div and add to cardPart1
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cardItems text-black flex gap-3 mb-3 ';

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class=" object-cover rounded"/>
            <div class="flex flex-col">
               <span class="text-xl font-semibold">${item.name}</span>
               <span class="text-sm text-gray-500 mt-2">Size: XL</span>
               <span class="text-sm text-gray-500 mt-2">Seller: maniaclife</span>
               <h1 class="text-orange-500 text-xl font-bold mt-2">₹${item.caloriesPerServing}</h1>
               <div class="flex gap-5 mt-5">
                  <div class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xl cursor-pointer">-</div>
                  <div class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md">1</div>
                  <div class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-xl cursor-pointer">+</div>
                  <button onclick="removeFromCart()" class="text-blue-600 font-medium ml-4 cursor-pointer">Remove</button>
               </div>
            </div>
            
        `;

        cardPart1.appendChild(div);
    });
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










