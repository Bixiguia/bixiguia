


function updateHash(marker) {
    "use strict";
    window.location.hash = 'p=' + marker.data.nome_slug;
}

function showLocalDetails(marker){
    "use strict";

    marker.raw.setAnimation(google.maps.Animation.BOUNCE);

    $.ajax({
        url: GLOBALS.URLS.detalha_local.replace('999', marker.data.nome_slug),
        success: function(data) {
            updateHash(marker);
            flip.show(
                $(data).filter('.cabecalho').html(),
                $(data).filter('.conteudo').html()
            );

            $('#flip .fotos a').colorbox({
                rel:'fotos',
                'opacity': 0.7,
                'previous': '&laquo;',
                'next': '&raquo;',
                'close': 'x',
                'current': '{current}/{total}',
                'maxHeight' : '90%',
                'maxWidth': '90%'
            });

            marker.raw.setAnimation(null);
        }
    });
}

$(document).ready(function($){
    "use strict";

    window.flip = Flip();

    function projetoToggle(callback) {
        callback();
        //flip.show(
        //    $('#projeto-info .header').html(),
        //    $('#projeto-info .content').html(),
        //    callback
        //);
    }

    function createColorMark(position) {
        return new google.maps.MarkerImage(
            GLOBALS.URLS.STATIC_URL + 'imagens/mapa/marcadores/comuns.png',
            new google.maps.Size(12, 20),
            new google.maps.Point(22 + (position*12), 0),
            new google.maps.Point(10, 20)
        );
    }

    window.createSpecialMark = function (position) {

        return new google.maps.MarkerImage(
            GLOBALS.URLS.STATIC_URL + 'imagens/mapa/marcadores/especiais.png',
            new google.maps.Size(30, 40),
            new google.maps.Point(position*30, 0),
            new google.maps.Point(15, 38)
        );
    };

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

    google.maps.visualRefresh = true;
    window.mapEl = new MapBoss($('#map_canvas'),
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
    //mapEl.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(homeControlDiv);

    google.maps.event.addListenerOnce(mapEl.map, 'idle', function() {
        projetoToggle(function(){loadData();});
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
                }, function(){
                    var matches = window.location.hash.match(/(#p|&p)=(.+?)(&|$)/);

                    if (matches && matches.length >= 3) {
                        var slug = matches[2];
                        for (var i=0; i<mapEl.markers.length; i++) {
                            var marker = mapEl.markers[i];
                            if (marker.data.nome_slug &&
                                marker.data.nome_slug === slug)
                                showLocalDetails(marker);
                        }
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
                    .addClass('custom-control');

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
                    .css('visibility', 'hidden')
                    .addClass('lista-categorias')
                    .appendTo(markersListControl);

                google.maps.event.addDomListener(markersListControlButton.get(0), 'click', function(){
                    if (!$(this).hasClass('active')) {
                        
                        $(this).addClass('active')
                            .children('i')
                                .removeClass('icon-chevron-right')
                                .addClass('icon-chevron-down');

                        mlControlList
                            .css('overflow', 'hidden')
                            .animate({
                                opacity:1,
                                height: mlControlList.data('height')
                            }, 1000, function(){
                                $(this).css('overflow', 'auto');
                        });

                    } else {
                        $(this).removeClass('active')
                            .children('i')
                                .removeClass('icon-chevron-right')
                                .addClass('icon-chevron-down');

                        mlControlList.css('overflow', 'hidden');
                        mlControlList.animate({
                            opacity:0,
                            height: 0
                        }, 1000);
                    }
                });

                $(window).resize(function(){
                    var maxFilterHeight = ($(mapEl.map.getDiv()).height() - ($(markersListControl).offset().top + $(markersListControl).children().first().outerHeight())) * 0.85;
                    mlControlList
                        .data('height', Math.min(mlControlList.data('full-height'), maxFilterHeight))
                        .height(mlControlList.data('height'));
                });

                /* this settimeout with delay 0 let the map add the control to
                    dom before we need to use it */
                setTimeout(function() {

                    $.each(categories, function(index, categoria) {
                        $('<li />')
                            .append($('<a />')
                                .attr('href', '#')
                                .data('categora-nome', categoria.nome)
                                .append(
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
                        'visibility':'visible'
                    });

                    var maxFilterHeight = ($(mapEl.map.getDiv()).height() - ($(markersListControl).offset().top + $(markersListControl).children().first().outerHeight())) * 0.85;

                    mlControlList
                        .data('full-height', mlControlList.innerHeight())
                        .data('height', Math.min(mlControlList.innerHeight(), maxFilterHeight))
                        .css('height', 0);

                    $('a', mlControlList).each(function(){
                        $(this).data('active', true);
                        google.maps.event.addDomListener(this, 'click', function(e){
                            e.preventDefault();
                            if ($(this).data('active')) {
                                $(this)
                                    .data('active', false)
                                    .children('.check').css('opacity', 0.1)
                                    .end()
                                    .children('.marker').css('opacity', 0.8);
                                mapEl.setMarkersVisibility(false, {
                                    'categoria':$(this).data('categora-nome')
                                });

                            } else {
                                $(this)
                                    .data('active', true)
                                    .children('.check').css('opacity', 0.6)
                                    .end()
                                    .children('.marker').css('opacity', 1);
                                mapEl.setMarkersVisibility(true, {
                                    'categoria':$(this).data('categora-nome')
                                });
                            }
                        });
                    });

                    markersListControlButton.trigger('click');

                }, 0);

                addGeoLocationOption(mapEl, google.maps.ControlPosition.LEFT_BOTTOM);

            }
        );
    }
});
