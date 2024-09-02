let currentInfoWindow = null;

function initMap() {
    const defaultLocation = { lat: 35.6895, lng: 139.6917 }; // 東京都中心のデフォルト位置
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: defaultLocation,
        gestureHandling: "greedy",  // スマホでの1本指スクロールを有効化
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    { "color": "#f0fdff" }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#01579B" }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    { "color": "#E0F7FA" }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "color": "#81D4FA" }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#0288D1" }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "color": "#b2f0aa" }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#81D4FA" }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#01579B" }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#85ccf2" }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#069a88" }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#7da6bd" }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    { "color": "#01579B" }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#7da6bd" }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#81D4FA" }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#0288D1" }
                ]
            }
        ],
        zoomControl: true,           // 拡大縮小ボタンを表示
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP // 拡大縮小ボタンを画面左に配置
        },
        fullscreenControl: false,    // 全画面表示ボタンを非表示
        streetViewControl: false,    // ストリートビューボタンを非表示
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
    }

        // マーカー用の配列
        const markers = [];

    // JSONファイルから水族館のデータを取得
    fetch('aquariums.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
                const markers = []; // マーカーを格納する配列

            data.forEach(aquarium => {
                const marker = new google.maps.Marker({
                    position: { lat: aquarium.latitude, lng: aquarium.longitude },
                    map: map,
                    title: aquarium.name,
                   icon: {
                        url: 'img/aquamap_pin.png', // カスタムピン画像の相対パス
                        scaledSize: new google.maps.Size(42, 42) // ピンのサイズを42x42に指定
                    }
                });

                markers.push(marker); // マーカーを配列に追加

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div style="position: relative; padding-right: 20px;">
                            <h3 style="margin: 0; font-size: 16px;">
                                <a href="${aquarium.URL}" target="_blank" style="color: black; text-decoration: none;">
                                    ${aquarium.name}
                                </a>
                            </h3>
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

                    // クリックしたピンの位置を地図の中心に設定 (スムーズに移動)
                    map.panTo(marker.getPosition());
                });

                google.maps.event.addListener(infoWindow, 'domready', function() {
                    document.querySelector('.custom-close-btn').addEventListener('click', function() {
                        infoWindow.close();
                    });
                });
            });

            // マーカークラスタリングを追加
            new MarkerClusterer(map, markers, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
        })        
     
        .catch(error => {
            console.error('Error loading JSON data:', error);
        });
}


// 残りのコードは変更なし


document.getElementById("menu-icon").addEventListener("click", function() {
    const menuPage = document.getElementById("menu-page");

    if (menuPage.style.display === "none" || menuPage.style.display === "") {
        menuPage.style.display = "flex";
        setTimeout(function() {
            menuPage.classList.add("show");
            menuPage.classList.remove("hide");
        }, 10); // リフローを確実にするための小さな遅延
    } else if (menuPage.classList.contains("show")) {
        menuPage.classList.remove("show");
        menuPage.classList.add("hide");

        setTimeout(function() {
            menuPage.style.display = "none";
        }, 300); // CSSのtransition時間と一致させる
    }
});

document.getElementById("close-menu").addEventListener("click", function() {
    const menuPage = document.getElementById("menu-page");

    menuPage.classList.remove("show");
    menuPage.classList.add("hide");

    setTimeout(function() {
        menuPage.style.display = "none";
    }, 300); // CSSのtransition時間と一致させる
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

document.addEventListener("DOMContentLoaded", function() {
    const pageId = "nav-aquamap"; // 今回はAQUAMAPページが表示されていると仮定

    // 対象のリンクにactiveクラスを追加
    document.getElementById(pageId).classList.add("active");
});
