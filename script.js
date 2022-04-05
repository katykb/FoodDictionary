var foodName = document.getElementById("search");
var searchBtn = document.getElementById("foodSearchButton");
let storedFoodArray = [];

if (localStorage.getItem("storedItems")) {
    storedFoodArray = JSON.parse(localStorage.getItem("storedItems"));
}

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    getNutrients(foodName.value);
    getRecipe(foodName.value);

    var date = new Date(Date.now());
    var dateString = new Intl.DateTimeFormat("default", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
    }).format(date);

    var storedItem = {
        food: foodName.value,
        date: date,
        dateString: dateString,
    };
    storedFoodArray.push(storedItem);
    localStorage.setItem("storedItems", JSON.stringify(storedFoodArray));
});

var storedRecipeArray = [];
if (localStorage.getItem("storedRecipes")) {
    storedRecipeArray = JSON.parse(localStorage.getItem("storedRecipes"));
}

function getRecipe(foodName) {
    var recipeRequestUrl =
        "https://api.edamam.com/api/recipes/v2?type=public&q=" +
        foodName +
        "&app_id=61881171&app_key=cf039096837f9493c42a82711335486d";
    fetch(recipeRequestUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log("getRecipe data", data.hits);
            //properties from each recipe object - label, images.REGULAR.url, .ingredientLines(this is an array of strings), loop
            document.querySelector(".recipe-container").innerHTML = ""; //this will stop appending the recipes
            for (i = 0; i < data.hits.length; i++) {
                var recipe = data.hits[i].recipe;

                var title = recipe.label;
                var image = recipe.images.REGULAR.url;
                var ingredients = recipe.ingredientLines;
                displayRecipe(title, image, ingredients, recipe);
            }
        });
}

function getNutrients(foodName) {
    var requestUrl =
        "https://api.nal.usda.gov/fdc/v1/foods/search?query=" +
        foodName +
        "&pageSize=2&api_key=vuZ8WUcvpMr1mNoGUwWsyX4AWHv3LLaeRcZpDoga";

    fetch(requestUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            console.log(data.foods[0].foodNutrients);
            var foodNutrients = data.foods[0].foodNutrients;

            var sugar = foodNutrients.find(function(nutrient) {
                if (nutrient.nutrientName === "Sugars, total including NLEA") {
                    return true;
                } else {
                    return false;
                }
            });

            var calories = foodNutrients.find(function(nutrient) {
                // console.log(nutrient.nutrientName);
                //    return nutrient.nutrientName==="Energy";
                if (nutrient.nutrientName === "Energy") {
                    return true;
                } else {
                    return false;
                }
            });

            var carb = foodNutrients.find(function(nutrient) {
                if (nutrient.nutrientName === "Carbohydrate, by difference") {
                    return true;
                } else {
                    return false;
                }
            });

            var fat = foodNutrients.find(function(nutrient) {
                if (nutrient.nutrientName === "Total lipid (fat)") {
                    return true;
                } else {
                    return false;
                }
            });

            var protein = foodNutrients.find(function(nutrient) {
                return nutrient.nutrientName === "Protein"; //same as above just written different.
            });
            console.log(carb.value + " " + carb.unitName);
            console.log(calories.value + " " + calories.unitName);
            console.log(sugar.value);
            console.log(protein.value + " " + protein.unitName);
            displayNutrients(carb, protein, fat, sugar, calories);
        });
}

function displayNutrients(carb, protein, fat, sugar, calories) {
    document.querySelector(
        ".test"
    ).innerHTML = `<p>Calories.....${calories.value} ${calories.unitName}</p>
        <p>Protein.....${protein.value} ${protein.unitName}</p>
        <p>Fat.....${fat.value} ${fat.unitName}</p>
        <p>sugar.....${sugar.value} ${sugar.unitName}</p>
        <p>carb.....${carb.value} ${carb.unitName}</p>`;
}

function displayRecipe(title, image, ingredients, recipe) {
    console.log("Display recipe ", title, image, ingredients);
    var liTags = "";
    for (let i = 0; i < ingredients.length; i++) {
        liTags += `<li>${ingredients[i]}</li>`;
    }
    console.log(liTags);
    var recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-card");
    recipeDiv.innerHTML = `
    <img src=${image} alt=${title}>
        <div class='bookmarkBtn'>bookmark</div>
            <h3>${title}</h3>
            <ul>
                ${liTags}
            </ul>`;
    document.querySelector(".recipe-container").append(recipeDiv);
    var bookmarkBtns = document.querySelectorAll(".bookmarkBtn");
    for (i = 0; i < bookmarkBtns.length; i++) {
        bookmarkBtns[i].addEventListener("click", function() {
            storedRecipeArray.push(recipe);
            localStorage.setItem("storedRecipes", JSON.stringify(storedRecipeArray));
            console.log("XXXXX");
        });
    }
}
//use this later for practice making HTML strings using a for loop.
//CSS - all have the class of recipe-card
//could add classes or use .recipecard>h3 for any h3 with the class recipeCard change whatever.  Targets the child inside the parent.  add a class to the img