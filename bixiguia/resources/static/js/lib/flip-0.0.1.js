(function($) {

    Flip = function(options) {

        /*  Garante que a classe seja instanciada com o operador 'new'
            Referência: http://ejohn.org/apps/learn/#36 */
        if (!(this instanceof Flip))
            return new Flip(options);

        /*  A variável self é usada nas funções onde a variável this é
            sobrescrita (binds) */
        var self = this;

        /* default settings */
        this.settings = {
            'speed': 1000
        };

        if (options) {
            $.extend(this.settings, options);
        }

        this.show = function(header, content, speed) {

            if (typeof speed == "undefined")
                speed = this.settings.speed;

            this.headerEl.html(header);
            this.contentEl.html(content);
            adjustInternalElements();

            if (self.flipEl.data('status') == 'hidden') {
                var deltaAnimation = (self.elDimensions.position.left / 2);

                this.flipEl.css({
                    'opacity':0,
                    'display':'block',
                    'left': (self.elDimensions.position.left + deltaAnimation),
                    'right': (deltaAnimation * -1)
                });

                this.flipEl.animate({
                    opacity:1,
                    left: self.elDimensions.position.left,
                    right: 0
                }, speed, function() {
                    self.flipEl.attr('style', 'display:block;');
                    self.flipEl.data('status', 'visible');
                });
            }
        };

        this.close = function(speed){

            if (typeof speed == "undefined")
                speed = this.settings.speed;

            if (self.flipEl.data('status') == 'visible') {
                var deltaAnimation = (self.elDimensions.position.left / 2);

                this.flipEl.animate({
                    opacity:0,
                    left: (self.elDimensions.position.left + deltaAnimation),
                    right: (deltaAnimation * -1)
                }, speed, function() {
                    self.flipEl.attr('style', 'display:none;');
                    self.flipEl.data('status', 'hidden');
                });
            }

        };

        function prepareForMeasure(func) {

            var origCss = {};
            var hidden = false;

            if (self.flipEl.css('display') != 'block') {
                hidden = true;

                origCss = {
                    'visibility': self.flipEl.css('visibility'),
                    'display': self.flipEl.css('display')
                };

                self.flipEl.css({visibility:'hidden', display:'block'});
            }

            func();

            if (hidden)
                self.flipEl.css({
                    visibility:origCss.visibility,
                    display:origCss.display
                });
        }

        function adjustInternalElements() {
            prepareForMeasure(function() {
                getSizePosition();
                self.contentEl.height(
                    self.elDimensions.height - self.headerEl.height()
                );
            });
        }

        function createElements() {
            if (!$('#flip').length) {
                self.flipEl = $('<div />', {
                    'id': 'flip',
                    'data-status':'hidden'
                });
                self.flipEl.append(
                    $('<a />',   {'class': 'close', 'href': '#'}),
                    $('<div />', {'class': 'header'}),
                    $('<div />', {'class': 'content'})
                );
                $('body').append(self.flipEl);

            } else {
                self.flipEl = $('#flip');
            }

            self.headerEl = $('#flip .header');
            self.contentEl = $('#flip .content');
        }

        function createBinds() {
            $('#flip a.close').click(function(){
                self.close();
            });
        }

        function getSizePosition(){
            prepareForMeasure(function() {
                self.elDimensions = {
                    'position': self.flipEl.position(),
                    'width': self.flipEl.width(),
                    'height': self.flipEl.height()
                };
            });
        }

        function init() {
            createElements();
            createBinds();
            getSizePosition();
            $(window).resize(adjustInternalElements);
        }


        // this.open(header, content, speed)
        // this.close()
        //

        init();

    };

})(jQuery);
