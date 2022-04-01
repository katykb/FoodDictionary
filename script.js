var requestUrl =
  "https://api.nal.usda.gov/fdc/v1/foods/search?query=twix&pageSize=2&api_key=vuZ8WUcvpMr1mNoGUwWsyX4AWHv3LLaeRcZpDoga";

function getRequest() {
  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.foods[0].foodNutrients);
      var foodNutrients = data.foods[0].foodNutrients;
      var sugar = foodNutrients.find(function(nutrient){
        if(nutrient.nutrientName === "Sugars, total including NLEA") {
          return true;
        } else {
          return false;
        }

      });

      var calories = foodNutrients.find(function (nutrient) {
        // console.log(nutrient.nutrientName);
        //    return nutrient.nutrientName==="Energy";
        if (nutrient.nutrientName === "Energy") {
          return true;
        } else {
          return false;
        }
      });

      console.log(calories.value);
      console.log(sugar.value)
    });
}
getRequest();
