# coding: utf-8

from django.core import serializers
from django.http import HttpResponse

from bixiguia.guia import models


json_serializer = serializers.get_serializer("json")()


def get_locais(request):

    response = HttpResponse()

    json_serializer.serialize(
            models.Local.objects.filter(visivel=True).all(),
            fields=('nome', 'categoria', 'latitude', 'longitude', 'endereco'),
            ensure_ascii=False,
            stream=response
    )

    return response
