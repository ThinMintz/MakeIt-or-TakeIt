$(function(){

    var appID, appKey;

    function recipeSearch() {
        appID = "_app_id=3123c164", appKey = "_app_key=0a453b6219d75c4f9b5bd7deafcd8724";
        let cuisine = "Italian", ingredients = "beef", start = ~~(Math.random() * 100),
        queryURL = `http://api.yummly.com/v1/api/recipes?${appID}&${appKey}&requirePictures=true&maxResult=4&start=${start}&allowedCuisine[]=cuisine^cuisine-${cuisine}&allowedIngredient[]=${ingredients}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            let result = response.matches;
            for (let index of result) {
                recipeReturn(index.id)
            }
        });
    }

    function recipeReturn(ID) {
        let queryURL = `http://api.yummly.com/v1/api/recipe/${ID}?${appID}&${appKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            let div = $(`<div class="col-xs-6">`);
            div.append(`<a href=${response.attribution.url} target="_blank"><h3>${response.name}</h3></a>`).append(`<img src=${response.images[0].hostedLargeUrl} />`);
            $("#recipeHome").append(div);
        });
    }

    $(document).on("click", ".btn", function() {
        $("#recipeHome").empty();
        recipeSearch();
    });

});
