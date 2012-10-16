
function showLocalDetails(marker){

    marker.raw.setAnimation(google.maps.Animation.BOUNCE);

    $.ajax({
        url: GLOBALS.URLS.detalha_local.replace('999', marker.data.nome_slug),
        success: function(data) {
            flip.show(
                $(data).filter('.cabecalho').html(),
                $(data).filter('.conteudo').html()
            );

            $('#flip .fotos a').colorbox({
                rel:'fotos',
                'opacity': 0.7,
                'previous': 'Anterior',
                'next': 'Próxima',
                'close': 'Fechar',
                'current': 'imagem {current} de {total}',
                'maxHeight' : '80%',
                'maxWidth': '80%'
            });

            marker.raw.setAnimation(null);
        }
    });
}

$(document).ready(function($){

    flip = Flip();

    function projetoToggle(callback) {
        flip.show(
            $('#projeto-info .header').html(),
            $('#projeto-info .content').html(),
            callback
        );
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


    mapEl = new MapBoss($('#map_canvas'),
        {
            zoom: 16,
            minZoom: 14,
            center: new google.maps.LatLng(-23.55909, -46.64582),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
    );

    var homeControlDiv = $('<div />')
            .attr('class', 'logos-control')
            .attr('title', 'Sobre o projeto...')
            .click(function(){projetoToggle();})
            .get(0);

    homeControlDiv.index = 1;
    mapEl.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(homeControlDiv);

    google.maps.event.addListenerOnce(mapEl.map, 'idle', function() {
        loadData();
    });

    function loadData() {

        $.getJSON(
            GLOBALS.URLS.lista_categorias,
            function(raw_categories) {

                var other_categories_count = 0;
                var categories = $.map(raw_categories, function(raw) {
                    if (raw.fields.icon_index === null) {
                        other_categories_count += raw.extras.locals;
                        return null;
                    } else if (raw.extras.locals > 0)
                        return {
                            'nome': raw.fields.nome,
                            'nome_slug': raw.fields.nome_slug,
                            'icon_index': raw.fields.icon_index,
                            'locals': raw.extras.locals
                        };
                });
                if (other_categories_count > 0)
                    categories.push({
                        'nome': 'Outros',
                        'nome_slug': 'outros',
                        'icon_index': 0,
                        'locals': other_categories_count
                    });

                var categories_filter = $.map(categories, function(cat) {
                    return {
                        'markerOptions' : {'icon': createColorMark(cat.icon_index)},
                        'filter': {'categoria':cat.nome}
                    };
                });

                var mapFilters = [
                        {
                            'filter': {
                                'model': 'guia.local'
                            },
                            'markerOptions' : {
                                'shadow': marksShadow,
                                'icon': createColorMark(0)
                            },
                            'events' : {
                                'click': showLocalDetails
                            }
                        }
                    ].concat(
                        categories_filter,
                    [
                        {
                            'filter': {
                                'model': 'guia.specials'
                            },
                            'markerOptions' : {'shadow': specialMarksShadow},
                            'events' : {
                                'click': function(){projetoToggle();}
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
                    ]);

                mapEl.setFilters(mapFilters);

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


                var markersListControl = $('<div />')
                    .addClass('control-categorias');

                var markersListControlButton = $('<button />')
                    .addClass('btn btn-small btn-categorias')
                    .attr('type', 'button')
                    .html(' Categorias')
                    .prepend($('<i />').addClass('icon-chevron-right'))
                    .appendTo(
                        $('<div />')
                            .addClass('btn-categorias-container')
                            .appendTo(markersListControl)
                    );

                markersListControl.index = 1;
                mapEl.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(markersListControl.get(0));

                var mlControlList = $('<ul />')
                    .attr('style', 'display:none;')
                    .addClass('lista-categorias')
                    .appendTo(markersListControl);

                $.each(categories, function(index, categoria) {
                    $('<li />')
                        .append($('<a />')
                            .attr('href', '#')
                            .append(
                                //$('<input />').attr('type', 'checkbox'),
                                $('<i />').addClass('icon-ok check'),
                                $('<span />').addClass('marker')
                                    .attr('style', 'background-position:' + (-22 - (categoria.icon_index * 12)) + 'px'),
                                $('<span />').addClass('nome').html(categoria.nome),
                                $('<span />').addClass('locals').html('(' + categoria.locals + ')')
                            )
                        ).appendTo(mlControlList);
                });

                mlControlList.css({
                    'opacity':0,
                    'display':'block'
                });

                mlControlList.data('height', mlControlList.height());

                mlControlList.css('height', 0);

                mlControlList.animate({
                    opacity:1,
                    height: mlControlList.data('height')
                }, 1000);


                // (tot - lista-top) * 0.8

            }
        );
    }
});
