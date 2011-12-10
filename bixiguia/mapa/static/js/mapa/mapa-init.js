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

    wall.css({
        'display': 'block',
        'opacity': 0
    });

    wall.fadeTo("slow",  0.75);

    var container = getPersistentDiv('detalhamento');
    container.css(getMapSize(60));

    $('#detalhamento').load(
        GLOBALS.URLS.detalha_local.replace('999', marker.data.nome_slug),
        function() {
            $('.btn', container).click(function(){
                wall.fadeOut("slow");
                container.fadeOut("slow");
            });
            container.fadeIn("slow", function(){
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
        wall.fadeOut("slow");
        container.fadeOut("slow");
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
            GLOBALS.URLS.STATIC_URL + 'imagens/mapa/marcadores/comuns.png',
            new google.maps.Size(12, 20),
            new google.maps.Point(22 + (position*12), 0),
            new google.maps.Point(10, 20)
        );
    }

    function createSpecialMark(position) {
        return new google.maps.MarkerImage(
            GLOBALS.URLS.STATIC_URL + 'imagens/mapa/marcadores/especiais.png',
            new google.maps.Size(30, 40),
            new google.maps.Point(position*30, 0),
            new google.maps.Point(15, 38)
        );
    }

    var marksShadow = new google.maps.MarkerImage(
        GLOBALS.URLS.STATIC_URL + 'imagens/mapa/marcadores/sombra.png',
        new google.maps.Size(22, 20),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 20)
    );

    var specialMarksShadow = new google.maps.MarkerImage(
        GLOBALS.URLS.STATIC_URL + 'imagens/mapa/marcadores/sombra-especiais.png',
        new google.maps.Size(51, 40),
        new google.maps.Point(0, 0),
        new google.maps.Point(15, 38)
    );


    adjustMapSize('bind');

    mapEl = new MapBoss($('#mapa'),
            {
                zoom: 16,
                minZoom: 14,
                center: new google.maps.LatLng(-23.55909, -46.64582),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            [
                {
                    'filter': {
                        'model': 'guia.local'
                    },
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
                },
                {
                    'filter': {
                        'model': 'guia.specials'
                    },
                    'markerOptions' : {'shadow': specialMarksShadow},
                    'events' : {
                        'click': projetoToggle
                    }
                },
                {
                    'markerOptions' : {'icon': createSpecialMark(0)},
                    'filter': {'nome':"Universidade Presbiteriana Mackenzie"}
                },
                {
                    'markerOptions' : {'icon': createSpecialMark(1)},
                    'filter': {'nome':"Associação Novolhar"}
                }
            ]
        );

    mapEl.loadMarkers(GLOBALS.URLS.lista_locais, {
        'mapfunc': function(data){
            data.fields.model = data.model;
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

    mapEl.loadMarkers(GLOBALS.URLS.lista_locais_especiais, {
        'mapfunc': function(data){
            return {
                'lat':data.latitude,
                'lng':data.longitude,
                'data': {
                    'nome': data.nome,
                    'model':'guia.specials'
                },
                'options': {
                    'title': data.nome
                }
            };
        }
    });

    var homeControlDiv = $('<div />')
            .attr('class', 'logos-control')
            .attr('title', 'Sobre o projeto...')
            .click(projetoToggle)
            .get(0);

    homeControlDiv.index = 1;
    mapEl.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(homeControlDiv);
});
