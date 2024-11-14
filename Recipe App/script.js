const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const searchInput = document.getElementById('search-input');
const loader = document.querySelector('.loader'); // элемент для лоудинга

// Ваш API-ключ для Spoonacular
const apiKey = 'e6d155a9933846ce8b798555e79af907';
let currentPage = 1;
const resultsPerPage = 10; // Количество рецептов на страницу

// event listeners
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        currentPage = 1;
        getMealList();
    }
});
searchBtn.addEventListener('click', () => {
    currentPage = 1; // сброс страницы при новом поиске
    getMealList();
});
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        getMealList();
    }
});
nextBtn.addEventListener('click', () => {
    currentPage++;
    getMealList();
});

// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    let offset = (currentPage - 1) * resultsPerPage;
    
    // Показать лоудер перед началом запроса
    loader.style.display = 'block';
    mealList.innerHTML = ''; // Очистить предыдущие результаты
    
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${searchInputTxt}&number=${resultsPerPage}&offset=${offset}&apiKey=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.length){
            data.forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.id}">
                        <div class="meal-img">
                            <img src="${meal.image}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.title}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else {
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;

        // Управление кнопками пагинации
        prevBtn.style.display = currentPage > 1 ? 'inline' : 'none';
        nextBtn.style.display = data.length < resultsPerPage ? 'none' : 'inline';
    })
    .finally(() => {
        // Скрыть лоудер после завершения запроса
        loader.style.display = 'none';
    });
}

// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information?apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    let html = `
        <h2 class="recipe-title">${meal.title}</h2>
        <p class="recipe-category">${meal.dishTypes ? meal.dishTypes.join(', ') : ''}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.instructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">View Recipe</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
