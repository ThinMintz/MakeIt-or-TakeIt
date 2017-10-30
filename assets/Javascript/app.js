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
                let div = $(`<div class="col-xs-12">`);
                div.append(`<br><h3>No recipes found. Please try a different ingredient!</h3>`);

                $("#recipeHome").append(div);
            }
            else {
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
            let div = $(`<div class="col-xs-6">`);
            div.append(`<a href=${response.attribution.url} target="_blank"><h3>${response.name}</h3></a>`).append(`<img class="recipe-image" src=${response.images[0].hostedLargeUrl} />`);
            $("#recipeHome").append(div);
        });
    }

    function validText(text) {  
        let letters = /^[A-Za-z '-]+$/;  
        return text.match(letters) ? true : false;  
    }  

    $(document).on("click", "#makeIt", function() {
        event.preventDefault();
        $("#recipeHome").empty();
        let cuisine = $("#cuisineChoice").val(), course = $("#courseChoice").val(), ingredient = $("#ingredientChoice").val(), math = ~~(Math.random() * 50);
        validText(ingredient) 
            ? (console.log(`New recipe search for ${cuisine} ${course.toLowerCase()} that contain ${ingredient}, starting from result #${math + 1}...`), ingredient = ingredient.toLowerCase())
            : (console.log("Invalid ingredient; ignoring parameter."), console.log(`New recipe search for ${cuisine} ${course.toLowerCase()}, starting from result #${math + 1}...`), ingredient = false);
        cuisine = cuisine.toLowerCase().replace(/\s+/g, '');
        recipeSearch(cuisine, course, ingredient, math);
    });
    //end Alex's code
  





    //Will's coding portion
$("#takeIt").on("click", function(){


    function foursquareApi(){
        let clientId = "MKSDIAW4TPUGKG2VZVL1AWA3Y0RRNE4IL1DBEGOUTE5V4GWD";
        let clientSecret = "QOSAAQPN015GOWGVZ5XOOCSE5LERPN5KBZRACT4DJNN1MBUG";
        let userZip = $("#zipcode").val().trim();
        let userCuisineInput = $("#cuisineChoice").val()
        let queryURL = "https://api.foursquare.com/v2/venues/search?v=20161016&near="+userZip+"&query=chineserestaurant&intent=checkin&limit=10&client_id="+clientId+"&client_secret="+clientSecret;


        $.getJSON({
            url: queryURL
        }).done(function(response){
            console.log(response);
            // console.log(response.response.venues["0"]);
            // console.log("Restaurant name: "+response.response.venues["0"].name);
            // console.log("Restaurant location: "+response.response.venues["0"].location.address);
            // console.log("Restaurant contact: "+response.response.venues["0"].contact.formattedPhone);
            // console.log("Restaurant menu link: "+response.response.venues["0"].menu.url);
            // console.log("Restaurant id: "+response.response.venues["0"].id);

            // $("#takeIt").on("click", function(){

            
            // var zipTest = $("#zipcode").val().trim();
            for(let i = 0; i < 10; i++){
            console.log(i);
            var restaurantName = response.response.venues[i].name;
            var restaurantLocation = response.response.venues[i].location.address;
            var restaurantContact = response.response.venues[i].contact.formattedPhone;
            // var restaurantMenuLink = response.response.venues[i].menu.url;
            var restaurantDiv = $("<div>");




            var a = restaurantName + restaurantLocation + restaurantContact ;
            console.log(a);

            restaurantDiv.append(a);

           }; 

        });


        
        
    };




    foursquareApi();

});



























});

