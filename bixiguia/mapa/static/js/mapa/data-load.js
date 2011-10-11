/**
 * Mostra os pontos no mapa
 */
function show_data(map, data) {
    
    // para cada ponto existente no banco
    for (var i = 0; i < data.length; i++) {

        // pega informações referentes ao local
        local = data[i];
        
        // cria o marcador referente ao ponto
        marker = new google.maps.Marker({
            'position': new google.maps.LatLng(
                local.fields.latitude,
                local.fields.longitude
            ),
            'map': map,
            'title': local.fields.nome
        });
        
        // adiciona listener para abrir janela quando o marker for clicado
        (function(marker, local){
            google.maps.event.addListener(marker, 'click', function(){
                infowindow = new google.maps.InfoWindow({
                    content: '<font size=3><b>' + local.fields.nome + '</b>\n\<br /></font>' 
                        + '<font size=2>' + local.fields.endereco + '</font>',
                    size: new google.maps.Size(50,50),
                    position: marker.position

                });
                infowindow.open(map);
            });
        })(marker, local);
        
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
