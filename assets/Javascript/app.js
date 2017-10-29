$(function(){

    //begin Alex's code
    const yummlyID = "_app_id=3123c164", yummlyKey = "_app_key=0a453b6219d75c4f9b5bd7deafcd8724";

    function recipeSearch(cuisine, course, ingredient, math) {
        let ingredientSearch = "";
        if (ingredient) ingredientSearch = `&allowedIngredient[]=${ingredient}`;
        let queryURL = `http://api.yummly.com/v1/api/recipes?${yummlyID}&${yummlyKey}&requirePictures=true&maxResult=4&start=${math}&allowedCuisine[]=cuisine^cuisine-${cuisine}&allowedCourse[]=course^course-${course}${ingredientSearch}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) { 
            let result = response.matches;
            if (result.length < 4 && math) {
                math = math - 10;
                if (math < 0) math = 0;
                console.log(`Retrying search, starting from result #${math + 1}...`);
                recipeSearch(cuisine, course, ingredient, math);
            }
            else if (result.length < 4 && !math) {
                console.log("Search failed. No results found.");
                $("#recipeHome").html(`<div class="col-xs-12"><h3>No recipes found. Please try a different ingredient!</h3></div>`);
            }
            else {
                $("#recipeHome").empty();
                console.log(`Displaying search results #${math + 1}, #${math + 2}, #${math + 3}, and #${math + 4}.`);
                for (let index of result) recipeReturn(index.id);
            }
        });
    }

    function recipeReturn(ID) {
        let queryURL = `http://api.yummly.com/v1/api/recipe/${ID}?${yummlyID}&${yummlyKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            let div = $(`<div class="col-md-6 col-xs-12 recipe-div">`);
            div.append(`<a href=${response.attribution.url} target="_blank"><h4>${response.name}</h4></a>`).append(`<a href=${response.attribution.url} target="_blank"><img class="recipe-image" src=${response.images[0].imageUrlsBySize["360"]} /></a>`);
            $("#recipeHome").append(div);
        });
    }

    function validText(text) {  
        let letters = /^[A-Za-z '-]+$/;  
        return text.match(letters) ? true : false;  
    } 

    $(document).on("click", "#makeIt", function() {
        event.preventDefault();
        $("#recipeHome").html(`<div class="col-xs-12"><h3>Searching for recipes<span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span></h3></div>`);
        let cuisine = $("#cuisineChoice").val(), course = $("#courseChoice").val(), ingredient = $("#ingredientChoice").val(), math = ~~(Math.random() * 50);
        validText(ingredient) 
            ? (console.log(`New recipe search for ${cuisine} ${course.toLowerCase()} that contain ${ingredient}, starting from result #${math + 1}...`), ingredient = ingredient.toLowerCase())
            : (console.log("Invalid ingredient; ignoring parameter."), console.log(`New recipe search for ${cuisine} ${course.toLowerCase()}, starting from result #${math + 1}...`), ingredient = false);
        cuisine = cuisine.toLowerCase().replace(/\s+/g, '');
        recipeSearch(cuisine, course, ingredient, math);
    });

    document.body.addEventListener("load", function(event){
        if($(event.target).attr("class") === "recipe-image") document.getElementById("recipeHome").scrollIntoView({ behavior: 'smooth' , block: 'start', inline: 'nearest'});
    }, true);
    //end Alex's code
  





    //Will's coding portion
    function foursquareApi(){
        let clientId = "MKSDIAW4TPUGKG2VZVL1AWA3Y0RRNE4IL1DBEGOUTE5V4GWD";
        let clientSecret = "QOSAAQPN015GOWGVZ5XOOCSE5LERPN5KBZRACT4DJNN1MBUG";
        let userZip = $("#zipcode").val().trim();
        let queryURL = "https://api.foursquare.com/v2/venues/search?v=20161016&near=60646&query=chinese&intent=checkin&limit=10&client_id="+clientId+"&client_secret="+clientSecret;


        $.getJSON({
            url: queryURL
        }).done(function(response){
            console.log(response);

        })
    };

    foursquareApi();




























});

