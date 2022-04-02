var requestUrl =
  "https://api.nal.usda.gov/fdc/v1/foods/search?query=beef&pageSize=2&api_key=vuZ8WUcvpMr1mNoGUwWsyX4AWHv3LLaeRcZpDoga";

var recipeRequestUrl =
  "https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=61881171&app_key=cf039096837f9493c42a82711335486d";

function getRecipe() {
  fetch(recipeRequestUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
}
getRecipe();

function getRequest() {
  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.foods[0].foodNutrients);
      var foodNutrients = data.foods[0].foodNutrients;

      //can we consolidate this in any way?
      var sugar = foodNutrients.find(function (nutrient) {
        if (nutrient.nutrientName === "Sugars, total including NLEA") {
          return true;
        } else {
          return false;
        }
      });

      var carb = foodNutrients.find(function (nutrient) {
        if (nutrient.nutrientName === "Carbohydrate, by difference") {
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

      var fat= foodNutrients.find(function(nutrient) {
          if (nutrient.nutrientName === "Total lipid (fat)"){
              return true;
          }else{
              return false;
          }
      })

      console.log(calories.value);
      console.log(sugar.value);
      console.log(carb.value);
      console.log(fat.value);
    });
}
getRequest("chicken");