function getRequest(foodName) {
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

            var protein = foodNutrients.find(function(nutrient) {
                return nutrient.nutrientName === "Protein"; //same as above just written different.
            });

            console.log(calories.value + " " + calories.unitName);
            console.log(sugar.value);
            console.log(protein.value + " " + protein.unitName);
        });
}
getRequest("chicken");