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

            if (self.flipEl.data('status') == 'hidden') {

                this.flipEl.css({
                    'opacity':0,
                    'display':'block',
                    'width': self.elDimensions.width * 0.9
                });

                this.flipEl.animate({
                    opacity:1,
                    width: self.elDimensions.width
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
                this.flipEl.animate({
                    opacity:0,
                    width: self.elDimensions.width * 0.9
                }, speed, function() {
                    self.flipEl.attr('style', 'display:none;');
                    self.flipEl.data('status', 'hidden');
                });
            }

        };

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

            var origCss = {};
            var hidden = false;
            var fcss = self.flipEl.css;

            if (fcss('display') != 'block') {
                hidden = true;

                origCss = {
                    'visibility': fcss('visibility'),
                    'display': fcss('display')
                };

                fcss({visibility:'hidden', display:'block'});
            }


            self.elDimensions = {
                'position': self.flipEl.position(),
                'width': self.flipEl.width(),
                'height': self.flipEl.height()
            };

            if (hidden)
                self.flipEl.css({
                    visibility:origCss.visibility,
                    display:origCss.display
                });
        }

        function init() {
            createElements();
            createBinds();
            getSizePosition();
            $(window).resize(getSizePosition);
        }


        // this.open(header, content, speed)
        // this.close()
        //

        init();

    };

})(jQuery);
