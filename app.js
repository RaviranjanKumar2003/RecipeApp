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



const recipesDetails=document.querySelector('.recipeContainer')

async function getAllmeals(){
    recipesDetails.innerHTML=`<h1 class="mt-6 text-2xl">Loading....</h1>`;
    try {
        const response=await fetch('https://dummyjson.com/recipes')
        const data=await response.json()
        console.log( data.recipes);
        
        recipesDetails.innerHTML=" "
        data.recipes.forEach(element => {
            // console.log(element.name);
            const recipeDiv=document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML=`
            <div class="img flex">
                <img src="${element.image}" alt="${element.name}"/>
                <div class="name">
                  <h1 class="text-2xl font-bold ml-5">${element.name}</h1>
                  <h3 class="text-xl ml-5 mt-5">MealType : ${element.mealType}</h3>
                  <h3 class="text-xl ml-5 mt-5">Rating : ${element.rating}</h3>
                  <div class="flex gap-6 ml-5 mt-5">
                     <span class="px-3 py-1 rounded-md text-sm font-semibold bg-green-100 text-green-600">Vegetarian</span>
                     <span class="px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-1 bg-orange-100 text-orange-600">🌶️Medium</span>
                  </div>
                </div>
            </div>
            <div class="price">
                <h1 class="text-[#fb923c] text-2xl font-bold ml-10">₹${element.caloriesPerServing}</h1>
                <button class="addToCard mt-20 ml-auto bg-orange-400 text-white px-4 py-2 sm:py-2 rounded-md font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center cursor-pointer">Add to Card</button>
            </div>
         `;
         recipesDetails.appendChild(recipeDiv);
        });
        
       
        
    } catch (error) {
        console.log("E:",error);
        
    }
}
getAllmeals()









