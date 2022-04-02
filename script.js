var foodName = document.getElementById("search");
var searchBtn = document.getElementById("foodSearchButton");

searchBtn.addEventListener("click", function(event) {
    event.preventDefault();
    getNutrients(foodName.value);
});

function getRecipe(foodName) {
    var recipeRequestUrl =
        "https://api.edamam.com/api/recipes/v2?type=public&q=" +
        foodName +
        "&app_id=61881171&app_key=cf039096837f9493c42a82711335486d";
    fetch(recipeRequestUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
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

            console.log(calories.value + " " + calories.unitName);
            console.log(sugar.value);
            console.log(protein.value + " " + protein.unitName);
        });
}