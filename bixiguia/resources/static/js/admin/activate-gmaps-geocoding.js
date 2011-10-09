(function($){

    $(document).ready(function($){

        if ($("body").hasClass('guia-local') && $("body").hasClass('change-form')) {

            var mapa_div = $('<div></div>')
                            .attr('id', 'map')
                            .css('position', 'absolute')
                            .appendTo($('fieldset').first());

            posiciona_mapa(mapa_div);
            $(window).resize(function(){posiciona_mapa(mapa_div);});

            var map = GeoCoding(
                        '#id_endereco',
                        '#id_latitude',
                        '#id_longitude',
                        {
                            'map_el': mapa_div,
                            'addr_suffix': ', São Paulo, SP'
                        }
            );
        }

    });


    function posiciona_mapa(el){

        var ref = {
            'nome': $('#id_nome'),
            'end': $('#id_endereco'),
            'desc': $('#id_descricao')
        };

        var padding = 10;
        var hor_borders = parseInt(el.css('borderLeftWidth')) + parseInt(el.css('borderRightWidth'));
        var ver_borders = parseInt(el.css('borderTopWidth')) + parseInt(el.css('borderBottomWidth'));

        var left = ref.end.offset().left + ref.end.outerWidth() + padding;
        var top = ref.nome.offset().top;
        var width = ref.desc.offset().left + ref.desc.outerWidth() - left - hor_borders;
        var height = ref.desc.offset().top - top - padding - ver_borders;

        el.css({'top': top, 'left': left});
        el.css({'width':width, 'height': height});
    }

})(django.jQuery);

