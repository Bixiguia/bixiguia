from django.conf.urls.defaults import patterns, include, url


urlpatterns = patterns('bixiguia.guia.views',
    # Examples:
    url(r'^locais$', 'get_locais', name='guia.locais'),
    #url(r'^locais/1$', 'get_local', name='guia.local'),
)
