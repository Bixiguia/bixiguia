from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('bixiguia.mapa.views',
    # Examples:
    url(r'^globals.js$', direct_to_template, {'template': 'globals.js'}, name="globals_js"),

    url(r'^$', 'index', name='mapa.index'),
    url(r'^data/', include('bixiguia.guia.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
     url(r'^admin/', include(admin.site.urls)),
)
