var requestUrl ="https://api.nal.usda.gov/fdc/v1/foods/search?query=snickers&pageSize=2&api_key=vuZ8WUcvpMr1mNoGUwWsyX4AWHv3LLaeRcZpDoga"

function getRequest() {
    
      fetch(requestUrl)
        .then((response) => response.json())
        .then((data) => console.log(data));
    };
getRequest();