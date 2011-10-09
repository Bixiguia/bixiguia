# coding: utf-8

from django.shortcuts import render_to_response
from django.template import RequestContext

from bixiguia.guia import models


def locals(request):

    locais = models.Local.objects.all()

    return render_to_response(
        'mapa/index.html',
        {'locais': locais},
        context_instance=RequestContext(request))
