var GLOBALS = {
    'URLS': {
        'MEDIA_URL': '{{ MEDIA_URL }}',
        'STATIC_URL': '{{ STATIC_URL }}',
        'lista_locais': '{% url guia.locais %}',
        'lista_categorias': '{% url guia.categorias %}',
        'lista_locais_especiais': '{% url guia.locais_especiais %}',
        'detalha_local': '{% url guia.local 999 %}'
    }
};
