$(function(){

    
    //begin Alex's code
    var yummlyID = "_app_id=3123c164", yummlyKey = "_app_key=0a453b6219d75c4f9b5bd7deafcd8724";

    function recipeSearch(cuisine, course, ingredient, math) {
        var ingredientSearch = "";
        if (ingredient) {
            var ingredientSearch = `&allowedIngredient[]=${ingredient}`;
        }
        let queryURL = `http://api.yummly.com/v1/api/recipes?${yummlyID}&${yummlyKey}&requirePictures=true&maxResult=4&start=${math}&allowedCuisine[]=cuisine^cuisine-${cuisine}&allowedCourse[]=course^course-${course}${ingredientSearch}`;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) { 
            let result = response.matches;
            if (result.length < 4 && math) {
                math = math - 10;
                if (math < 0) {
                    math = 0;
                }
                console.log("Retrying search...");
                recipeSearch(cuisine, course, ingredient, math);
            }
            else if (result.length < 4 && !math) {
                console.log("Search failed.");
                let div = $(`<div class="col-xs-6">`);
                div.append(`<h3>No results found. Please try a different ingredient!</h3>`);
                $("#recipeHome").append(div);
            }
            else {
                console.log(`Displaying search results #${math}, #${math + 1}, #${math + 2}, and #${math + 3}.`)
                for (let index of result) {
                    recipeReturn(index.id)
                }
            }
        });
    }

    function recipeReturn(ID) {
        let queryURL = `http://api.yummly.com/v1/api/recipe/${ID}?${yummlyID}&${yummlyKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            let div = $(`<div class="col-xs-6">`);
            div.append(`<a href=${response.attribution.url} target="_blank"><h3>${response.name}</h3></a>`).append(`<img src=${response.images[0].hostedLargeUrl} />`);
            $("#recipeHome").append(div);
        });
    }

    $(document).on("click", "#makeIt", function() {
        console.log("Starting search...")
        let cuisine = $("#cuisineChoice").val().toLowerCase().replace(/\s+/g, ''), course = $("#courseChoice").val().replace(/\s+/g, ''), ingredient = $("#ingredientChoice").val(), math = ~~(Math.random() * 50);
        $("#recipeHome").empty();
        recipeSearch(cuisine, course, ingredient, math);
    });
    //end Alex's code
  





    //Will's coding portion
    /*function restaurantSearch(){
        var apiKey = "AIzaSyDNd-YznTLDle5yj2H7ORcuWMpIEXjOnzs";
        var userZipcode = "60646";
        var cuisine = "chinese";
        var queryURL = "https://maps.googleapis.com/maps/api/place/textsearch/xml?query=" + cuisine + "restaurants+in+" + userZipcode + "&key=" + apiKey;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response){
            console.log(response);
        });

    }
        restaurantSearch();*/

});

