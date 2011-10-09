function show_data(map, data) {
    for (var i=0; i<data.length; i++) {

        local = data[i];

        marker = new google.maps.Marker(
                    {
                        'position': new google.maps.LatLng(
                            local.fields.latitude,
                            local.fields.longitude
                        ),
                        'map': map,
                        'title': local.fields.nome
                    });
    }
};

function get_data(url) {
    $.getJSON(url, function(data){
        show_data(mapa, data);
    });
}

$(document).ready(function($){
    get_data('/data/locais');
});
