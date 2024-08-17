
// script.js

function initMap() {
    const tokyo = { lat: 35.6895, lng: 139.6917 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: tokyo,
    });

    const marker = new google.maps.Marker({
        position: tokyo,
        map: map,
        title: "東京都の水族館",
    });
}

document.getElementById("menu-icon").addEventListener("click", function() {
    const menuBar = document.getElementById("menu-bar");
    if (menuBar.style.display === "none" || menuBar.style.display === "") {
        menuBar.style.display = "block";
    } else {
        menuBar.style.display = "none";
    }
});

document.getElementById("search-button").addEventListener("click", function() {
    const searchBar = document.getElementById("search-bar");
    if (searchBar.style.display === "none" || searchBar.style.display === "") {
        searchBar.style.display = "flex";
    } else {
        searchBar.style.display = "none";
    }
});
