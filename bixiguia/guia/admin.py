# coding: utf-8

import django.db.models
from django.contrib import admin
from django.forms import Textarea

from sorl.thumbnail.admin import AdminImageMixin

from bixiguia.guia import models

overrides = {
    django.db.models.TextField: {'widget': Textarea(attrs={'rows': 3, 'cols': 40, 'class': 'vLargeTextField'})},
}


class NovoModelAdmin(admin.ModelAdmin):
    formfield_overrides = overrides


class CategoriaAdmin(NovoModelAdmin):
    date_hierarchy = 'data_criacao'
    list_display = ('nome', 'visivel')
    list_display_links = ('nome',)
    prepopulated_fields = {"nome_slug": ("nome",)}
    search_fields = ('nome',)
    list_filter = ('visivel',)
admin.site.register(models.Categoria, CategoriaAdmin)


class VideoAdmin(NovoModelAdmin):
    date_hierarchy = 'data_criacao'
    list_display = ('titulo', 'url', 'visivel')
    list_display_links = ('titulo', 'url')
    search_fields = ('titulo',)
    list_filter = ('visivel',)
admin.site.register(models.Video, VideoAdmin)


class FotoAdmin(NovoModelAdmin):
    date_hierarchy = 'data_criacao'
    list_display = ('titulo', 'visivel')
    list_display_links = ('titulo',)
    search_fields = ('titulo',)
    list_filter = ('visivel',)
admin.site.register(models.Foto, FotoAdmin)


class FotoInline(AdminImageMixin, admin.TabularInline):
    model = models.Foto


class VideoInline(admin.TabularInline):
    model = models.Video


class LocalAdmin(NovoModelAdmin):
    date_hierarchy = 'data_criacao'
    list_display = ('nome', 'categoria', 'endereco', 'ano_fundacao', 'visivel')
    list_display_links = ('nome',)
    prepopulated_fields = {"nome_slug": ("nome",)}
    search_fields = ('nome', 'endereco', 'descricao', 'contatos', 'site', 'email')
    list_filter = ('categoria', 'visivel',)

    inlines = [FotoInline, VideoInline]

    class Media:
        js = (
            "js/admin/jquery-no-conflict.js",
            "http://maps.googleapis.com/maps/api/js?sensor=false",
            "js/admin/gmaps-geocoding.js",
            "js/admin/activate-gmaps-geocoding.js",
        )

        css = {
            "all": ("css/admin/admin.css",)
        }
admin.site.register(models.Local, LocalAdmin)
