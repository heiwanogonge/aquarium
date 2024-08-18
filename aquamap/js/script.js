// script.js

function initMap() {
    const tokyo = { lat: 35.6895, lng: 139.6917 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: tokyo,
    });

    const aquariums = [
        { name: 'サンシャイン水族館', lat: 35.7295, lng: 139.7177, prefecture: '東京都', url: '#' },
        { name: '葛西臨海水族園', lat: 35.6402, lng: 139.8791, prefecture: '東京都', url: '#' },
        { name: 'アクアパーク品川', lat: 35.6275, lng: 139.7402, prefecture: '東京都', url: '#' },
        { name: 'すみだ水族館', lat: 35.7100, lng: 139.8107, prefecture: '東京都', url: '#' },
        { name: 'しながわ水族館', lat: 35.6085, lng: 139.7387, prefecture: '東京都', url: '#' }
    ];

    aquariums.forEach(function(aquarium) {
        const marker = new google.maps.Marker({
            position: { lat: aquarium.lat, lng: aquarium.lng },
            map: map,
            title: aquarium.name
        });
    
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="position: relative;">
                    <h3 style="margin: 0; font-size: 16px;"><a href="${aquarium.url}" target="_blank" style="color: black; text-decoration: none;">${aquarium.name}</a></h3>
                    <p style="margin: 4px 0; font-size: 14px;">${aquarium.prefecture}</p>
                    <span class="custom-close-btn" style="cursor: pointer; position: absolute; top: 0; right: 0; font-size: 18px; line-height: 1; padding: 2px; color: black;">&times;</span>
                </div>
            `,
            disableAutoPan: true  // デフォルトの閉じるボタンを無効化
        });
    
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    
        google.maps.event.addListener(infoWindow, 'domready', function() {
            document.querySelector('.custom-close-btn').addEventListener('click', function() {
                infoWindow.close();
            });
        });
    });
     
}

document.getElementById("menu-icon").addEventListener("click", function() {
    const menuPage = document.getElementById("menu-page");
    if (menuPage.style.display === "none" || menuPage.style.display === "") {
        menuPage.style.display = "block";
    } else {
        menuPage.style.display = "none";
    }
});

document.getElementById('search-toggle').addEventListener('click', function() {
    const searchbar = document.getElementById('searchbar');
    if (searchbar.style.display === 'none' || searchbar.style.display === '') {
        searchbar.style.display = 'flex';
    } else {
        searchbar.style.display = 'none';
    }
});

document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': query }, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            map.setZoom(14);
        } else {
            alert('検索結果が見つかりませんでした: ' + status);
        }
    });
});

// 追加: メニューページを閉じる機能
document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.getElementById("menu-icon");
    const closeMenuBtn = document.getElementById("close-menu");
    const menuPage = document.getElementById("menu-page");

    menuIcon.addEventListener("click", function() {
        menuPage.style.display = "flex";
    });

    closeMenuBtn.addEventListener("click", function() {
        menuPage.style.display = "none";
    });
});

