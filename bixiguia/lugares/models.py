# coding: utf-8

from django.db import models


class Lugar(models.Model):
	nome = models.CharField(max_length=64, verbose_name=u"Nome")
	endereco = models.CharField(max_length=128, verbose_name=u"Endereço")
	latitude = models.FloatField(verbose_name=u'Latitude')
	longitude = models.FloatField(verbose_name=u'Longitude')

class Estabelecimento(Lugar):
	tipo = models.CharField(max_length=32, verbose_name=u"Tipo")
	data_abertura = models.DateField()

	def __str__(self):
		return '%s - %s' % (self.nome, self.endereco)
