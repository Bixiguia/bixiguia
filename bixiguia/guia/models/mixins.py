# coding: utf-8

from django.db import models
from django.contrib.auth.models import User


class DataMixin(models.Model):
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_ultima_modificacao = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class OrdemMixin(models.Model):

    # def get_posicao():
    #     try:
    #         return 0
    #         return objects.aggregate(models.Max('posicao'))['posicao__max'] + 1
    #     except TypeError:
    #         return 1

    posicao = models.SmallIntegerField(verbose_name=u'Posição')
    # posicao = models.SmallIntegerField(null=False, default=get_posicao)

    class Meta:
        abstract = True
        #ordering = ['posicao', ]  # ['posicao', 'nome']
        # unique_together = ['posicao', 'parentmodel']


class UsuarioMixin():
    criado_por = models.ForeignKey(User, null=True)
    alterado_por = models.ForeignKey(User, null=True)

    def save(*args, **kwargs):
        self = args[0]
        #import pdb; pdb.set_trace()

        super(UsuarioMixin, self).save(*args, **kwargs)

    class Meta:
        abstract = True
