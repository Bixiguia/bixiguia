(function($) {

    GeoCoding = function(address_el, lat_el, lng_el, options) {

        /*  Garante que a classe seja instanciada com o operador 'new'
            Referência: http://ejohn.org/apps/learn/#36 */
        if (!(this instanceof GeoCoding))
            return new GeoCoding(address_el, lat_el, lng_el, options);

        /*  A variável self é usada nas funções onde a variável this é
            sobrescrita (binds) */
        var self = this;

        this.settings = {
            'delay': 1000,
            'coords_decimals': 8,
            'addr_suffix': '',
            'map_el': null,
            'map_defaults': {
                zoom: 4,
                center: new google.maps.LatLng(-14.782928,-52.382812),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            'marker_options': {
                'draggable':true
            }
        };

        if (options) {
            $.extend(this.settings, options);
        }

        /* converte elementos passados como parâmetros para
           objetos jquery, se ainda não forem */
        this.els = convert_to_jquery(
                ['address_el', 'lat_el', 'lng_el'],
                 arguments
        );

        /* instancia o geocoder do google */
        this._geocoder = new google.maps.Geocoder();


        if (this.settings.map_el) {

            /*  se o elemento canvas passado for elemento jquery, retorna
                seu primeiro filho, o elemento DOM selecionado */
            canvas = this.settings.map_el instanceof jQuery ? this.settings.map_el[0] : this.settings.map_el;

            /* instancia o mapa */
            this._map = new google.maps.Map(canvas, this.settings.map_defaults);

            /* Marcador exibido no mapa */
            this._marker = new google.maps.Marker(
                            $.extend({
                                    'visible': false,
                                    'map': this._map
                                }, this.settings.marker_options)
            );

            google.maps.event.addListener(this._marker, 'drag',
                function(coords){
                    refresh_coords(coords.latLng, true);
                }
            );
        }

        /*  Se os campos de latitude e longitude já estiverem preenchidos,
            o mapa deve ser atualizado, caso exista */
        if (this.els.lat.val() && this.els.lng.val()) {
            refresh_coords(
                new google.maps.LatLng(this.els.lat.val(), this.els.lng.val())
            );
        }

        bind('input', this.settings.delay);

        function bind(event, delay) {

            self.els.address.bind(event, function(){
                var $this = $(this);

                clearTimeout($this.data('timer'));
                $this.data('timer', setTimeout(function(){
                    $this.removeData('timer');

                    self.read_address();

                }, delay));
            });
        }

        this.read_address = function(){

            address = this.els.address.val();
            this._geocoder.geocode({'address': address + this.settings.addr_suffix},
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK)
                        refresh_coords(results[0].geometry.location);
                    else
                        console.log("Geocode was not successful for the following reason: " + status);
                }
            );
        };

        function refresh_coords(coords, ignore_map) {

            var decs = self.settings.coords_decimals;

            if (self.settings.map_el && (!ignore_map)) {

                self._map.setZoom(17);
                self._map.setCenter(coords);

                self._marker.setOptions({
                    'visible': true,
                    position: coords
                });
            }

            self.els.lat.val(coords.lat().toFixed(decs));
            self.els.lng.val(coords.lng().toFixed(decs));
        }


        function convert_to_jquery(names, values) {
            var els = {};

            for (var pos in names) {
                var name = names[pos].substring(0, names[pos].length - 3);

                if (!(values[pos] instanceof $))
                    els[name] = $(values[pos]);
                else
                    els[name] = values[pos];
            }

            return els;
        }
    };

})(jQuery);
