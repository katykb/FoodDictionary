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

function getRecipe(foodName) {
  var recipeRequestUrl =
    "https://api.edamam.com/api/recipes/v2?type=public&q=" +
    foodName +
    "&app_id=61881171&app_key=cf039096837f9493c42a82711335486d";
  fetch(recipeRequestUrl)
    .then((response) => response.json())
    .then((data) => {
      // The inner html variables.
      let html = "";
      //   console.log(data);
      //   console.log(data.hits);
      //   console.log(data.hits[0].recipe.calories)
      //   console.log(data.hits[0].recipe.images.THUMBNAIL)
      //   console.log(data.hits[0].recipe.ingredients[0])
      //   var recipe = data.hits[""].recipe
      for (let i = 0; i < 5; i++) {
        let recipe = data.hits[i].recipe;
        let recipeName = recipe.label;
        let url = recipe.url;
        let image = recipe.images.REGULAR.url;
        let ingredients = "<ul>";

        //   code that sets the recipe cards
        for (let j = 0; j < recipe.ingredients.length; j++) {
          ingredients += `<li>${recipe.ingredients[j].text}</li>`;
        }
        ingredients += "</ul>";
        console.log(recipe);
        html += ` <div class="row">
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img src="${image}">
                <span class="card-title">${recipeName}</span>
              </div>
              <div class="card-content">
                <p>${ingredients}</p>
                <button data-reci=" {name:${recipeName},image:${image},ingredients:${ingredients}, url:${url}}" class="favoriteRecipe">Save Recipe</button>
              </div>
              <div class="card-action">
                <a href="${url}">Go to Recipe</a>
              </div>
            </div>
          </div>
        </div>
                  `;
      }

      document.querySelector(".containerRecipes").innerHTML = html;
      let buttons = document.querySelectorAll(".containerRecipes button");
      for (let button of buttons) {
        button.addEventListener("click", setRecipeStorage);
      }
    });
}
function setRecipeStorage(event) {
  let card = event.target.closest(".row");
  console.log(card);
  localStorage.setItem("recipeName", JSON.stringify(card));
}

// document.querySelector(".containerRecipes").addEventListener("click", saveFavoriteRecipe);

// function saveRecipe(event){
//   console.log(event, event.target.tagName)

//   if (event.target.tagName==="BUTTON"){
//     let element = event.target
//     // console.log(Element);
//     let saved = JSON.parse(localStorage.getItem("recipeName")) || []
//     let rec = event.target.getAttribute("data-reci")
//     saved.push(rec)
//     localStorage.setItem("recipeName", JSON.stringify(saved));
//     console.log(rec)
//       let myRecipe = {

//         //    image: element.closest("img").getAttribute("src"),
//             ingredients: element.previousSibling.innerText ,
//             // url: element.closest("a").getAttribute("href")
//               }
//               console.log(myRecipe);
//   }
// }

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

      var sugar = foodNutrients.find(function (nutrient) {
        if (nutrient.nutrientName === "Sugars, total including NLEA") {
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

      var carb = foodNutrients.find(function (nutrient) {
        if (nutrient.nutrientName === "Carbohydrate, by difference") {
          return true;
        } else {
          return false;
        }
      });

      var fat = foodNutrients.find(function (nutrient) {
        if (nutrient.nutrientName === "Total lipid (fat)") {
          return true;
        } else {
          return false;
        }
      });

      var protein = foodNutrients.find(function (nutrient) {
        return nutrient.nutrientName === "Protein"; //same as above just written different.
    });
    
    displayNutrients(carb, protein, fat, sugar, calories);
      
    console.log(calories.value + " " + calories.unitName);
      console.log(sugar.value);
      console.log(protein.value + " " + protein.unitName);

      function setFoodItemStorage(event) {
        localStorage.setItem("foodName", JSON.stringify(foodData));
        console.log(foodData);
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
    
      getRecipe(foodName);
      setFoodItemStorage();
      setRecipeStorage();
    });
}
