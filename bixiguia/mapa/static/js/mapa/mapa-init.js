$(document).ready(function($){

    mapa = new google.maps.Map($('#mapa')[0], {
                zoom: 16,
                center: new google.maps.LatLng(-23.55909, -46.64582),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
});
