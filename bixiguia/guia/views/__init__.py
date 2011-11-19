# coding: utf-8

from django.core import serializers
from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response

from bixiguia.guia import models

json_serializer = serializers.get_serializer("json")()


def get_locais(request):

    response = HttpResponse()

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
