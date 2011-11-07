function showLocalDetails(marker){
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

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

    function getWall() {

        var className = 'wall';
        var wall;

        if (!$('#' + className).length)
            wall = $('<div></div>')
                .attr('id', 'wall')
                .appendTo($('body'));
        else
            wall = $('#' + className);

        return wall;
    }

    function resizeWall(bind) {

        wall.css(getMapSize());

        if (typeof(bind) == 'string' && bind == 'bind')
            $(window).resize(function(){
                resizeWall();
            });
    }

    var wall = getWall();
    resizeWall('bind');

    wall.fadeTo("slow",0.75);

    var container = $('<div>as</div>')
        .attr('class', 'detalhes_local')
        .appendTo($('body'));

    container.css(getMapSize(60));
    container.fadeIn("slow");

    wall.click(function(){
        wall.fadeTo("slow", 0, function(){wall.hide();});
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
                    'markerOptions' : {'shadow': marksShadow},
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
                    'filter': {'categoria':"Teatro"}
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
