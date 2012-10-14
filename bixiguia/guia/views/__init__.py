# coding: utf-8

from django.core import serializers
from django.db.models import Count
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext


from bixiguia.guia import models

json_serializer = serializers.get_serializer("json")()


def get_locais(request):
    response = HttpResponse(mimetype='application/json')

    json_serializer.serialize(
            models.Local.objects.filter(visivel=True).all(),
            fields=('nome', 'nome_slug', 'categoria', 'latitude', 'longitude', 'endereco'),
            ensure_ascii=False,
            use_natural_keys=True,
            stream=response
    )
    return response


def get_local(request, local_slug):

    local = models.Local.objects.get(nome_slug=local_slug)

    return render_to_response(
        'guia/get_local.html',
        {'local': local},
        context_instance=RequestContext(request)
    )


def get_categorias(request):
    response = HttpResponse(mimetype='application/json')

    json_serializer.serialize(
        models.Categoria.objects.filter(visivel=True).annotate(locals=Count('local')),
        fields=('nome', 'nome_slug', 'icon_index'),
        extras=('locals',),
        ensure_ascii=False,
        use_natural_keys=True,
        stream=response
    )
    return response
