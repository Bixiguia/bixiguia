var MapBoss = function(canvas, initOptions, markersClasses) {
    "use strict";

    /*  Garante que a classe seja instanciada com o operador 'new'
        Referência: http://ejohn.org/apps/learn/#36 */
    if (!this instanceof MapBoss)
        return new MapBoss(canvas, initOptions, markersClasses);

    var self = this;
    var circleFilter = null;

    /*  merge das configurações iniciais com configurações padrão
        que centralizam o mapa no brasil usando o tipo ROADMAP */
    initOptions = $.extend({
        zoom: 4,
        center: new google.maps.LatLng(-14.782928,-52.382812),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
        }]
    }, initOptions);

    /*  se o elemento canvas passado for elemento jquery, retorna
        seu primeiro filho, o elemento DOM selecionado */
    canvas = canvas instanceof $ ? canvas[0] : canvas;

    this.markers = [];
    this.avaliableMarkerClasses = [];
    this.defaultMarkerClass = {'markerOptions':{},'events':{}};


    function getattr(obj, name, defvalue) {
        /*  retorna o valor do atributo de um objeto se ele existe,
            senão retorna devalue */
        if (obj.hasOwnProperty(name))
            return obj[name];
        return typeof defvalue == "undefined" ? null : defvalue;
    }

    function getMergedOptions(marker, filtered_options){

            /*  Cria array com opções que deverão ser mescladas para
                gerar as opções do marcador

                As opções são mantidas por odem de prioridade:
                    0.  Coordenadas especificas do marcador
                    1.  Demais opções especificas do próprio marcador
                    2.  Opções das classes que tem filtros que retornam o marcador
                    3.  Opções da classe padrão de marcadores

                A prioridade é definida pela posição inversa das opções no array.
                As últimas posições têm maior prioridade.
            */
            var optsToApply =
                [
                    {}, /* objeto vazio para armazenar a junção de tudo */
                    self.defaultMarkerClass.markerOptions /*  opções da classe padrão */
                ].concat(
                    filtered_options,
                    [
                        /* opções definidas no próprio marcador */
                        getattr(marker, 'options', {}),

                        /* coordenadas do marcador */
                        {
                            position: new google.maps.LatLng(
                                marker.lat,
                                marker.lng
                            ),
                            map: self.map
                        }
                    ]
                );


            /*  retona a mescla de todas as configurações listadas em
                optsToApply para serem aplicadas no marcardor */
            return $.extend.apply(self, optsToApply);
    }

    function createMarkers(markers) {

        $.each(markers, function(index, marker){

            /*  obtém todas as classes cujo filtro inclui o ponto */
            var matchingClasses = self.getMatchingClasses(marker);

            var markerParams = getMergedOptions(marker,
                    $.map(
                        /* lista com opções das classes que tem filtros
                            que batem com os dados do marcador */
                        matchingClasses,
                        function(mclass) {return mclass.markerOptions;}
                    )
            );

            /*  cria marcador com as configurações mescladas,
                adiciona esse marcador no mapa e o salva como o
                atributo 'raw' na variável 'marker' */
            marker.raw = new google.maps.Marker(markerParams);

            marker.queryVisibility = true;

            var events = [];
            if (getattr(self.defaultMarkerClass, 'events'))
                events.push(getattr(self.defaultMarkerClass, 'events'));

            events = events.concat($.map(matchingClasses,
                            function(mclass) {return getattr(mclass, 'events');}
                        ));

            self.attachEvent(marker, events);

            /*  salva marcador na lista de marcadores */
            self.markers.push(marker);

        });
    }

    this.setFilters = function(markersClasses) {

        /*  se for passado um objeto como parâmetro 'markersClasses', ele
            é definido como classe padrão para todos marcadores */
        if ($.isPlainObject(markersClasses))
            this.defaultMarkerClass = markersClasses;

        /*  se for passado um array, o último item definido sem nome e filtro
            é usado como classe padrão e é removido da lista de classes disponiveis */
        else if ($.isArray(markersClasses))
            $.each(markersClasses, function(index, mclass){
                if (!getattr(mclass, 'name') && !getattr(mclass, 'filter'))
                    self.defaultMarkerClass = mclass;
                else
                    self.avaliableMarkerClasses.push(mclass);
            });
    };

    this.prepareResize = function() {
        this.centerToReturn = this.map.getCenter();
    };

    this.checkResize = function(recenter) {
        google.maps.event.trigger(this.map, 'resize');

        if (this.centerToReturn && recenter) {
            this.map.panTo(this.centerToReturn);
            this.centerToReturn = undefined;
        }
    };

    this.loadMarkers = function(markers, options, cb){

        options = $.extend(
            {
                'startfunc':function(){},
                'endfunc':function(){}
            },
            options
        );

        if (typeof markers == 'string'){
            options.startfunc();
            $.getJSON(markers, function(data){
                options.endfunc();
                self.loadMarkers(data, options, cb);
            });
            return;
        }

        if (options.mapfunc)
            markers = $.map(markers, options.mapfunc);

        createMarkers(markers);
        if (cb)
            cb();
    };


    this._match = function(marker, mclass) {
        /*  verifica se um marcador bate com o filtro de uma classe */

        if (getattr(mclass, 'filter') && getattr(marker, 'data')) {
            for (var filter in mclass.filter)
                if (!marker.data.hasOwnProperty(filter) || marker.data[filter] != mclass.filter[filter])
                return false;
            return true;
        }
        return false;
    };

    this.setMarkersVisibility = function(visibility, filter) {
        var validMarkers = []
        
        $.each(self.markers, function(){
            if (self._match(this, {filter:filter})) {

                this.queryVisibility = visibility;
                this.raw.setVisible(visibility);
                validMarkers.push(this);

                if (circleFilter && !self._isInCircle(this))
                    this.raw.setVisible(false);
            }
        });

        return validMarkers;
    };

    this.getMatchingClasses = function(marker) {

        var matchingClasses = [];
        $.each(this.avaliableMarkerClasses, function(index, mclass){

            if (self._match(marker, mclass))
                matchingClasses.push(mclass);

        });
        return matchingClasses;
    };


    this.attachEvent = function(marker, classevs){
        $.each(classevs, function(index, classev){
            $.each(classev, function(ev, func){
                google.maps.event.addListener(
                        marker.raw,
                        ev,
                        function(e){func(marker, self, e);}
                    );
            });
        });
    };

    this._updateCircle = function() {
        $.each(self.markers, function(){
            if (!circleFilter || (circleFilter && self._isInCircle(this)))
                this.raw.setVisible(this.queryVisibility);
            else
                this.raw.setVisible(false);
        });
    }

    this.setCircleArea = function (polygon) {
        circleFilter = polygon;
        self._updateCircle();
    }

    this._isInCircle = function(marker) {
        var latLng = marker.raw.getPosition();
        return (circleFilter.getBounds().contains(latLng)
            && google.maps.geometry.spherical.computeDistanceBetween(
                circleFilter.getCenter(), latLng) <= circleFilter.getRadius());
    }

    this.setFilters(markersClasses);

    /* instancia o mapa */
    this.map = new google.maps.Map(canvas, initOptions);
};
