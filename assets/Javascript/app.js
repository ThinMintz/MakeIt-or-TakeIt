$(function(){

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
            console.log(result.length);
            if (!result.length && math) {
                console.log("redo");
                recipeSearch(cuisine, course, ingredient, 0);
            }
            else if (!result.length && !math) {
                let div = $(`<div class="col-xs-6">`);
                div.append(`<h3>No results found. Please try a different ingredient!</h3>`);
                $("#recipeHome").append(div);
            }
            else {
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
        let cuisine = $("#cuisineChoice").val().toLowerCase().replace(/\s+/g, ''), course = $("#courseChoice").val().replace(/\s+/g, ''), ingredient = $("#ingredientChoice").val().toLowerCase().replace(/\s+/g, ''), math = ~~(Math.random() * 50);
        $("#recipeHome").empty();
        recipeSearch(cuisine, course, ingredient, math);
    });

});
