function projetoToggle() {

    var projContainer = $('#projeto .container');
    var mapa = $('#mapa');
    var proj = $('#projeto');
    var mapaOrigWidth = mapa.width();

    mapa.css('width', mapa.width());
    proj.css('width', proj.width());

    var widthFinal = 0;
    var mapDif = function(start, now) {return start - now;};
    var setOpacity = function(state) {return 1 - state;};
    var finish = function() {
        proj.hide();
        mapa.css('width', '100%');
    };

    if (!proj.is(':visible')) {
        widthFinal = $(window).width() * 0.2;
        proj.show();

        mapDif = function(start, now) {return  (now * -1);};
        setOpacity = function(state) {return state;};
        finish = function() {
            proj.css('width', '20%');
            mapa.css('width', '80%');
        };
    }


    mapEl.prepareResize();

    $('#projeto').animate({
        'width': widthFinal
    }, {
        'duration': 1000,
        'step': function(now, fx) {
            mapa.css('width', mapaOrigWidth + mapDif(fx.start, fx.now));
            projContainer.css('opacity', setOpacity(fx.state));
        },
        'complete': function(){
            mapEl.checkResize(true);
            finish();
        }
    });
}


$(document).ready(function($){

    ajustaAlturaProjeto('bind');
    $('#projeto .container .fechar').click(projetoToggle);
});

function ajustaAlturaProjeto(bind){
    var winHeight = $(window).height();
    var headerHeight = $('#cabecalho').outerHeight();
    $('#projeto').css('height', winHeight - headerHeight);

    var projetoHeight = $('#projeto').innerHeight();
    $('#projeto .container').css('height', projetoHeight);

    if (bind == 'bind')
        $(window).resize(function(){
            ajustaAlturaProjeto();
        });
}
