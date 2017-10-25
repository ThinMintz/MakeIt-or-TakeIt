$(function(){
console.log("test");
    var appID, appKey;

    function recipeSearch() {
        appID = "_app_id=3123c164", appKey = "_app_key=0a453b6219d75c4f9b5bd7deafcd8724";
        let cuisine = "Italian", ingredients = "beef",
        queryURL = `http://api.yummly.com/v1/api/recipes?${appID}&${appKey}&requirePictures=true&maxResult=4&allowedCuisine[]=cuisine^cuisine-${cuisine}&allowedIngredient[]=${ingredients}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            var result = response.matches;
            for (let index of result) {
                recipeReturn(index.id)
            }
        });
    }

    function recipeReturn(ID) {
        let recipeID = ID, queryURL = `http://api.yummly.com/v1/api/recipe/${ID}?${appID}&${appKey}`;
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
        recipeSearch();
    });

});
