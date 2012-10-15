from django.conf.urls.defaults import patterns, url
from django.views.generic.simple import direct_to_template

urlpatterns = patterns('bixiguia.guia.views',
    # Examples:
    url(r'^locais$', 'get_locais', name='guia.locais'),
    url(r'^locais/(?P<local_slug>[0-9a-z_-]+)$', 'get_local', name='guia.local'),
    url(r'^locais_especiais$', direct_to_template, {'template': 'mapa/locais_especiais.json'}, name='guia.locais_especiais'),

    url(r'^categorias$', 'get_categorias', name='guia.categorias'),
)
