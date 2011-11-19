function getMapSize(contract){
    var mapPos = $('#mapa').offset();

    if (typeof(contract) != "number")
        contract = 0;

    return {
        'left': mapPos.left + contract,
        'top': mapPos.top + contract,
        'height': $('#mapa').outerHeight() - (contract * 2),
        'width': $('#mapa').outerWidth() - (contract * 2)
    };
}

function getPersistentDiv(id) {

    var divEl;

    if (!$('#' + id).length)
        divEl = $('<div></div>')
            .attr('id', id)
            .appendTo($('body'));
    else
        divEl = $('#' + id);

    return divEl;
}

function showLocalDetails(marker){

    function resizeWall(bind) {

        wall.css(getMapSize());

        if (typeof(bind) == 'string' && bind == 'bind')
            $(window).resize(function(){
                resizeWall();
            });
    }

    marker.raw.setAnimation(google.maps.Animation.BOUNCE);

    var wall = getPersistentDiv('wall');
    resizeWall('bind');

    wall.css('display', 'block');
    wall.fadeTo("slow",  0.75);

    var container = getPersistentDiv('detalhamento');
    container.css(getMapSize(60));

    $('#detalhamento').load(
        GLOBALS.URLS.detalha_local.replace('999', marker.data.nome_slug),
        function() {
            container.css('display', 'block');
            container.fadeTo("slow", 1, function(){
                marker.raw.setAnimation(null);
                $('#detalhamento .fotos a').colorbox({
                    rel:'fotos',
                    'opacity': 0.7,
                    'previous': 'Anterior',
                    'next': 'Próxima',
                    'close': 'Fechar',
                    'current': 'imagem {current} de {total}',
                    'maxHeight' : '90%',
                    'maxWidth': '90%'
                });
            });
        }
    );

    wall.click(function(){
        wall.fadeTo("slow", 0, function(){wall.hide();});
        container.fadeTo("slow", 0, function(){container.hide();});
    });


}

$(document).ready(function($){

    function adjustMapSize(bind){
        var winHeight = $(window).height();
        var headerHeight = $('#cabecalho').outerHeight();
        $('#mapa').css('height', winHeight - headerHeight);

        if (typeof(bind) == 'string' && bind == 'bind')
            $(window).resize(function(){
                adjustMapSize();
            });
    }

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

    adjustMapSize('bind');

    mapa = new MapBoss($('#mapa'),
            {
                zoom: 16,
                minZoom: 14,
                center: new google.maps.LatLng(-23.55909, -46.64582),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            [
                {
                    'markerOptions' : {
                        'shadow': marksShadow,
                        'icon': createColorMark(5)
                    },
                    'events' : {
                        'click': showLocalDetails
                    }
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
                    'filter': {'categoria':"Gastronomia"}
                },
                {
                    'markerOptions' : {'icon': createColorMark(6)},
                    'filter': {'categoria':"Comércio"}
                },
                {
                    'markerOptions' : {'icon': createColorMark(7)},
                    'filter': {'categoria':"Noite"}
                },
                {
                    'markerOptions' : {'icon': createColorMark(8)},
                    'filter': {'categoria':"Mirante"}
                }

            ]
        );

    mapa.loadMarkers(GLOBALS.URLS.lista_locais, {
        'mapfunc': function(data){
            return {
                'id':data.pk,
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
