$(document).ready(function($){


    function createColorMark(position) {
        return new google.maps.MarkerImage(
            GLOBALS.URLS.STATIC_URL + 'imagens/mapa/marcadores.png',
            new google.maps.Size(12, 20),
            new google.maps.Point(22 + (position*12), 0),
            new google.maps.Point(10, 20)
        );
    }

    var marksShadow = new google.maps.MarkerImage(
        GLOBALS.URLS.STATIC_URL + 'imagens/mapa/marcadores/sombra.png',
        new google.maps.Size(22, 20),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 20)
    );

    mapa = new MapBoss($('#mapa'),
            {
                zoom: 16,
                minZoom: 14,
                center: new google.maps.LatLng(-23.55909, -46.64582),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            [
                {
                    'markerOptions' : {'shadow': marksShadow}
                },
                {
                    'markerOptions' : {'icon': createColorMark(0)},
                    'filter': {'categoria':"Cultura"}
                },
                {
                    'markerOptions' : {'icon': createColorMark(1)},
                    'filter': {'categoria':"Igreja"}
                },
                {
                    'markerOptions' : {'icon': createColorMark(2)},
                    'filter': {'categoria':"Museu"}
                },
                {
                    'markerOptions' : {'icon': createColorMark(3)},
                    'filter': {'categoria':"Patrimônio"}
                },
                {
                    'markerOptions' : {'icon': createColorMark(4)},
                    'filter': {'categoria':"Praça"}
                },
                {
                    'markerOptions' : {'icon': createColorMark(5)},
                    'filter': {'categoria':"Teatro"}
                }

            ]
        );

    mapa.loadMarkers(GLOBALS.URLS.lista_locais, {
        'mapfunc': function(data){
            return {
                'lat':data.fields.latitude,
                'lng':data.fields.longitude,
                'data':data.fields,
                'options': {
                    'title': data.fields.nome
                }
            };
        }
    });
});
