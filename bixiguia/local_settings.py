# coding: utf-8

DEBUG = True
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        # 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'bixiguia',
        'USER': 'postgres_role',
        'PASSWORD': 'role_password',
        'HOST': '',
        'PORT': '',
    }
}

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://media.lawrence.com/media/", "http://example.com/media/"
MEDIA_URL = 'http://localhost:6001/'

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = '/static/'

__all__ = ['DEBUG', 'TEMPLATE_DEBUG', 'DATABASES', 'MEDIA_URL', 'STATIC_URL']
