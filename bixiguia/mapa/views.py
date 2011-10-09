# coding: utf-8

from django.shortcuts import render_to_response
from django.template import RequestContext

from bixiguia.guia import models


def index(request):

    fotos = models.Foto.objects.all()

    return render_to_response(
        'mapa/index.html',
        {
            'msg': 'ss',
            'fotos': fotos,
        },
        context_instance=RequestContext(request))
