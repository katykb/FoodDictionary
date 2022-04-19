var foodName = document.getElementById("search");
var searchBtn = document.getElementById("foodSearchButton");

let storedFoodArray = [];
recentSearches();
allHistoryTable();

function openTab(tabName, elmnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(tabName).style.display = "block";

  if (tabName === "myRecipes") {
    console.log("anyhting");
    let savedRecipes = [];
    if (localStorage.getItem("savedRecipes")) {
      savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
      var recipeContainer = document.getElementById("recipe-container");
      // without this it keeps appending, setting it to an empty string starts the div off with only the saved local data.
      recipeContainer.textContent = "";
      for (let i = 0; i < savedRecipes.length; i++) {
        var { image, label, url, ingredients } = savedRecipes[i];
        var recipeCard = document.createElement("div");
        var recipeImage = document.createElement("img");
        var recipeLabel = document.createElement("h3");
        var recipeIngredients = document.createElement("ul");
        var recipeLink = document.createElement("a");

        recipeImage.src = image;
        recipeLabel.textContent = label;
        recipeLink.href = url;
        recipeLink.innerText = "GO TO RECIPE";

        recipeCard.classList.add("recipe-card");
        recipeImage.classList.add("card-image");
        recipeLabel.classList.add("card-title");
        recipeIngredients.classList.add("card-content");
        recipeLink.classList.add("card-action");

        // for every ingredient in each recipe the loop runs x number of times
        for (let j = 0; j < ingredients.length; j++) {
          var ingredientText = ingredients[j].text;
          var ingredientListItem = document.createElement("li");
          ingredientListItem.textContent = ingredientText;
          recipeIngredients.appendChild(ingredientListItem);
        }

        recipeCard.appendChild(recipeImage);
        recipeCard.appendChild(recipeLabel);
        recipeCard.appendChild(recipeIngredients);
        recipeCard.appendChild(recipeLink);
        recipeContainer.appendChild(recipeCard);
        // recipeContainer.innerHTML = html;
      }
    }
  }
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

function recentSearches() {
  if (localStorage.getItem("storedItems")) {
    storedFoodArray = JSON.parse(localStorage.getItem("storedItems"));
    let html = "";
    var min = Math.min(storedFoodArray.length, 3);
    for (var i = 0; i < min; i++) {
      var food = storedFoodArray[i];
      let nutrients = food.nutrientInfo;

      var protein = nutrients.find((n) => n.nutrientName === "Protein"); //finding values from the array by a specific name
      var carbs = nutrients.find(
        (n) => n.nutrientName === "Carbohydrate, by difference"
      );
      var calories = nutrients.find((n) => n.nutrientName === "Energy");
      var fat = nutrients.find((n) => n.nutrientName === "Total lipid (fat)");
      var sugar = nutrients.find(
        (n) => n.nutrientName === "Sugars, total including NLEA"
      );
      html += `
      <tr>
      <td>${food.dateString}</td>
      <td>${food.food}</td>
      <td>${protein.value} </td>
      <td>${fat.value}${fat.unitName}</td>
            <td>${sugar.value}${sugar.unitName}</td>
                  <td>${carbs.value}${carbs.unitName}</td>
                        <td>${calories.value}${calories.unitName}</td>
      </tr>`;
    }
    document.querySelector("#recentSearches").innerHTML = html;
  }
}

function allHistoryTable() {
  if (localStorage.getItem("storedItems")) {
    storedFoodArray = JSON.parse(localStorage.getItem("storedItems"));
    let html = "";
    for (let food of storedFoodArray) {
      let nutrients = food.nutrientInfo;

      var protein = nutrients.find((n) => n.nutrientName === "Protein"); //finding values from the array by a specific name
      var carbs = nutrients.find(
        (n) => n.nutrientName === "Carbohydrate, by difference"
      );
      var calories = nutrients.find((n) => n.nutrientName === "Energy");
      var fat = nutrients.find((n) => n.nutrientName === "Total lipid (fat)");
      var sugar = nutrients.find(
        (n) => n.nutrientName === "Sugars, total including NLEA"
      );
      html += `
      <tr>
      <td>${food.dateString}</td>
      <td>${food.food}</td>
      <td>${protein.value} </td>
      <td>${fat.value}${fat.unitName}</td>
            <td>${sugar.value}${sugar.unitName}</td>
                  <td>${carbs.value}${carbs.unitName}</td>
                        <td>${calories.value}${calories.unitName}</td>
      </tr>`;
    }
    document.querySelector("#histories").innerHTML = html;
  }
}

if (localStorage.getItem("storedItems")) {
  //gets item from local storage and stores into an array to access the values. if we get items save them to the food array
  storedFoodArray = JSON.parse(localStorage.getItem("storedItems"));
}

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  getNutrients(foodName.value);
  getRecipe(foodName.value);
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

      let indexes = [];
      for (let i = 0; i < 3; i++) {
        let index;
        do {
          index = Math.floor(Math.random() * data.hits.length);
        } while (indexes.includes(index));
        indexes.push(index);
      }
      for (let i of indexes) {
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
        html += `
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img src="${image}">
                <span class="card-title">${recipeName}</span>
              </div>
              <div class="card-content">
                <p>${ingredients}</p>
                <button data-reci="${i}" class="favoriteRecipe">Save Recipe</button>
              </div>
              <div class="card-action">
                <a href="${url}">Go to Recipe</a>
              </div>
            </div>
          </div>
                         `;
      }

      document.querySelector(".containerRecipes").innerHTML = html;
      let buttons = document.querySelectorAll(".containerRecipes button");
      for (let button of buttons) {
        button.addEventListener("click", function (event) {
          let recipeIndex = event.target.dataset.reci;
          let recipeData = data.hits[recipeIndex].recipe;
          saveRecipe(recipeData);
        });
      }
    });
}

function saveRecipe(recipe) {
  let savedRecipes = [];
  if (localStorage.getItem("savedRecipes")) {
    savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  }
  savedRecipes.push(recipe);
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
}

function getNutrients(foodName) {
  var foodNutrients;
  var requestUrl =
    "https://api.nal.usda.gov/fdc/v1/foods/search?query=" +
    foodName +
    "&pageSize=2&api_key=vuZ8WUcvpMr1mNoGUwWsyX4AWHv3LLaeRcZpDoga";

  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.foods[0].foodNutrients);
      //this is the foodNutrients object/array maybe or an array that has objects
      foodNutrients = data.foods[0].foodNutrients;

      var sugar = foodNutrients.find(function (nutrient) {
        if (nutrient.nutrientName === "Sugars, total including NLEA") {
          return true;
        } else {
          return false;
        }
      });

      var calories = foodNutrients.find(function (nutrient) {
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
        //looking through the nutrients array and returning the value.
        if (nutrient.nutrientName === "Total lipid (fat)") {
          return true;
        } else {
          return false;
        }
      });

      var protein = foodNutrients.find(function (nutrient) {
        return nutrient.nutrientName === "Protein";
      });

      displayNutrients(carb, protein, fat, sugar, calories);

      console.log(calories.value + " " + calories.unitName);
      console.log(sugar.value);
      console.log(protein.value + " " + protein.unitName);

      var date = new Date(Date.now());
      var dateString = new Intl.DateTimeFormat("default", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      }).format(date);

      var storedItem = {
        food: foodName,
        date: date,
        dateString: dateString,
        nutrientInfo: foodNutrients,
      };

      var existingFoodItem = storedFoodArray.find(function (foodItem) {
        return foodItem.food === foodName;
      });
      console.log(existingFoodItem);
      if (existingFoodItem === undefined) {
        storedFoodArray.unshift(storedItem);
        localStorage.setItem("storedItems", JSON.stringify(storedFoodArray));
      }

      allHistoryTable();
      recentSearches();
    });
}
//moved out of the main function for more readability.
function displayNutrients(carb, protein, fat, sugar, calories) {
  document.querySelector(".test").innerHTML;
}
