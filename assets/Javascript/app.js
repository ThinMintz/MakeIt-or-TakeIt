$(function(){

    const yummlyID = "_app_id=3123c164", yummlyKey = "_app_key=0a453b6219d75c4f9b5bd7deafcd8724", foursqID = "MKSDIAW4TPUGKG2VZVL1AWA3Y0RRNE4IL1DBEGOUTE5V4GWD", foursqSecret = "QOSAAQPN015GOWGVZ5XOOCSE5LERPN5KBZRACT4DJNN1MBUG";

    (function () {
        let zipCode = localStorage.getItem("zipCode");
        if (zipCode) $("#zipcode").attr("value", zipCode);
    })();

    function recipeSearch(cuisine, course, ingredient, math) {
        let ingredientSearch = "";
        if (ingredient) ingredientSearch = `&allowedIngredient[]=${ingredient}`;
        let queryURL = `https://api.yummly.com/v1/api/recipes?${yummlyID}&${yummlyKey}&requirePictures=true&maxResult=4&start=${math}&allowedCuisine[]=cuisine^cuisine-${cuisine}&allowedCourse[]=course^course-${course}${ingredientSearch}`;
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
                searchAlert(`No recipes found. Please try a different ingredient!`);
            }
            else {
                $("#recipeHome").empty();
                console.log(`Displaying search results #${math + 1}, #${math + 2}, #${math + 3}, and #${math + 4}.`);
                for (let index of result) recipeReturn(index.id);
            }
        })
        .fail(function() {
            searchAlert(`Search failed. Please try a different search!`);
        });
    }

    function recipeReturn(ID) {
        let queryURL = `https://api.yummly.com/v1/api/recipe/${ID}?${yummlyID}&${yummlyKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            let div = $(`<div class="col-md-6 col-xs-12 recipe-div">`);
            div.append(`<div class="recipe-name"><a href=${response.attribution.url} target="_blank" title="${response.name}"><h4>${response.name}</h4></a></div>`)
                .append(`<a href=${response.attribution.url} target="_blank"><img class="recipe-image" src=${response.images[0].imageUrlsBySize["360"]} /></a>`);
            $("#recipeHome").append(div);
        });
    }

    function foursquareApi(userZip, userCuisineInput){
        let queryURL = `https://api.foursquare.com/v2/venues/search?v=20161016&near=${userZip}&query=${userCuisineInput}food&intent=checkin&limit=10&client_id=${foursqID}&client_secret=${foursqSecret}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response){
            let venues = response.response.venues, venueCount = 0;
            for (let index of venues) if (index.contact.formattedPhone) venueCount++;
            if (venueCount) {
                $("#recipeHome").empty();
                for (let index of venues) {
                    if (index.contact.formattedPhone) {
                        let div = $(`<div class="col-md-6 col-xs-12 rest-div">`), restName;
                        restName = index.url && index.hasMenu 
                            ? `<h3><a href=${index.url} target="_blank">${index.name}</a> (<a href=${index.menu.url} target="_blank">menu</a>)</h3>` 
                            : index.url && !index.hasMenu
                                ? `<h3><a href=${index.url} target="_blank">${index.name}</a></h3>`
                                : !index.url && index.hasMenu
                                    ? `<h3>${index.name} (<a href=${index.menu.url} target="_blank">menu</a>)</h3>`
                                    : `<h3>${index.name}</h3>`;
                        div.append(restName).append(`<h4>${index.location.address}<h4>`).append(`<h4>${index.contact.formattedPhone}<h4>`);
                        $("#places").append(div);
                    }
                }
                document.getElementById("places").scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
            }
            else {
                searchAlert(`No restaurants found. Please try a different search!`);
            }
        })
        .fail(function() {
            searchAlert(`Search failed. Please try a different search!`);
        });
    }

    function searchAlert(text) {
        $("#recipeHome").html(`<div class="col-xs-12"><h3>${text}</h3></div>`);
        document.getElementById("recipeHome").scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }

    function validText(text, string) {
        let letters = string ? /^[A-Za-z '-]+$/ : /^[0-9]+$/;
        return text.match(letters) && string 
            ? true
            : text.match(letters) && !string && (text).toString().length == 5
                ? true
                : false;
    } 

    $(document).on("click", "#makeIt", function() {
        event.preventDefault();
        $("#places").empty();
        searchAlert(`Searching for recipes<span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span>`);
        let cuisine = $("#cuisineChoice").val(), course = $("#courseChoice").val(), ingredient = $("#ingredientChoice").val(), math = ~~(Math.random() * 50);
        validText(ingredient, true) 
            ? (console.log(`New recipe search for ${cuisine} ${course.toLowerCase()} that contain ${ingredient}, starting from result #${math + 1}...`), ingredient = ingredient.toLowerCase())
            : (console.log("Invalid ingredient; ignoring parameter."), console.log(`New recipe search for ${cuisine} ${course.toLowerCase()}, starting from result #${math + 1}...`), ingredient = false);
        cuisine = cuisine.toLowerCase().replace(/\s+/g, '');
        recipeSearch(cuisine, course, ingredient, math);
    });

    $(document).on("click", "#takeIt", function() {
        event.preventDefault();
        $("#places").empty();
        let userZip = $("#zipcode").val().trim(), userCuisineInput = $("#cuisineChoice").val();
        validText(userZip, false)
            ? (searchAlert(`Searching for restaurants<span class="ellipsis-anim"><span>.</span><span>.</span><span>.</span></span>`), localStorage.setItem("zipCode", userZip), foursquareApi(userZip, userCuisineInput))
            : searchAlert(`Please input a valid ZIP Code!`);
    });
    
    document.body.addEventListener("load", function(event){
        if ($(event.target).attr("class") === "recipe-image") document.getElementById("recipeHome").scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }, true);

});