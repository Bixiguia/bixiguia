(function($) {
    "use strict";

    window.addGeoLocationOption = function(mapBoss, mapPosition) {

        if (!navigator.geolocation) {
            return false;
        }

        var watchPositionId = null,
            map = mapBoss.map,

            homeCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.5,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.05,
                editable: true,
                map: map
            }),

            homeMarker = new google.maps.Marker({
                map: map,
                icon: createSpecialMark(2)
            }),

            buttonControl = $('<button />')
                .addClass('btn btn-small btn-geolocation')
                .attr('type', 'button')
                .append($('<i />').addClass('icon-screenshot'))
                .append($('<span />')
                    .addClass('hidden-phone')
                    .text(' Sua localização')),

            mapControl = $('<div />')
                .addClass('custom-control')
                .append(buttonControl).get(0);

        map.controls[mapPosition].push(mapControl);
        homeCircle.bindTo('center', homeMarker, 'position');

        homeCircle.addListener('radius_changed', function(){
            map.fitBounds(homeCircle.getBounds());
            mapBoss.setCircleArea(homeCircle);
        });

        function updatePosition(geodata) {

            var currentPosition = new google.maps.LatLng(
                geodata.coords.latitude,
                geodata.coords.longitude);

            homeCircle.setOptions({
                center: currentPosition,
                /* raio inicial de 500m + imprecisao da localizacao */
                radius: 500 + (geodata.coords.accuracy < 10000 ? geodata.coords.accuracy : 1000)
            });

            /* prevent cricle center change */
            google.maps.event.clearListeners(homeCircle, 'center_changed');
            homeCircle.addListener('center_changed', function () {
                if (homeCircle.getCenter() !== currentPosition)
                    homeCircle.setCenter(currentPosition);
            });

            homeMarker.setPosition(currentPosition);
            map.panTo(currentPosition);

            buttonControl.addClass('active');
            homeCircle.setVisible(true);
            homeMarker.setVisible(true);
        }

        function disableGeoLocation() {
            navigator.geolocation.clearWatch(watchPositionId);
            mapBoss.setCircleArea(null);
            homeCircle.setVisible(false);
            homeMarker.setVisible(false);
            buttonControl.removeClass('active');

        }

        google.maps.event.addDomListener(mapControl, 'click',
            function () {

                if (!buttonControl.hasClass('active')) {

                    watchPositionId = navigator.geolocation.watchPosition(
                        updatePosition, /* success func */
                        function(status) { /* failure func */
                            alert('Não foi possível obter sua localização.\n' +
                                  'Verifique se seu navegador tem suporte e autorização à essa operação.\n\n' +
                                  'ERRO: ' + status.message);
                        }
                    );


                } else
                    disableGeoLocation();
            }
        );
    };

})($);