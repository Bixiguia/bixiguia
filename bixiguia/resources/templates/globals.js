var GLOBALS = {
    'URLS': {
        'MEDIA_URL': '{{ MEDIA_URL }}',
        'STATIC_URL': '{{ STATIC_URL }}',
        'lista_locais': '{% url guia.locais %}',
        'detalha_local': '{% url guia.local 999 %}'
    }
};
