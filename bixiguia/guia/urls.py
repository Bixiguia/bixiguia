from django.conf.urls.defaults import patterns, include, url


urlpatterns = patterns('bixiguia.guia.views',
    # Examples:
    url(r'^locais$', 'get_locais', name='guia.locais'),
    url(r'^locais/(?P<local_slug>[0-9a-z_-]+)$', 'get_local', name='guia.local'),
)
