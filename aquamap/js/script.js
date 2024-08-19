let currentInfoWindow = null;

function initMap() {
    const defaultLocation = { lat: 35.6895, lng: 139.6917 }; // 東京都中心のデフォルト位置

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: defaultLocation,
    });

    // 現在地の取得
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(userLocation);
        }, function() {
            // 現在地取得に失敗した場合の処理（デフォルトの位置を使う）
            map.setCenter(defaultLocation);
        });
    } else {
        // Geolocationがサポートされていない場合の処理（デフォルトの位置を使う）
        map.setCenter(defaultLocation);
    };
    
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
                <div style="position: relative; padding-right: 20px;">
                    <h3 style="margin: 0; font-size: 16px;"><a href="${aquarium.url}" target="_blank" style="color: black; text-decoration: none;">${aquarium.name}</a></h3>
                    <p style="margin: 4px 0; font-size: 14px;">${aquarium.prefecture}</p>
                    <span class="custom-close-btn" style="cursor: pointer; position: absolute; top: -10px; right: 3px; font-size: 25px; color: black;">&times;</span>
                </div>
            `
        });
    
        marker.addListener('click', function() {
            // 現在開いているInfoWindowを閉じる
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            
            // 新しく開くInfoWindowをセットし、開く
            currentInfoWindow = infoWindow;
            infoWindow.open(map, marker);

            // クリックしたピンの位置を地図の中心に設定
            map.setCenter(marker.getPosition());
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
