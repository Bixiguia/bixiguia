# coding: utf-8

from django.db import models


class Categoria(models.Model):
    nome = models.CharField(max_length=64)
    nome_slug = models.SlugField(max_length=64)


class Local(models.Model):
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_ultima_modificacao = models.DateTimeField(auto_now=True)

    nome = models.CharField(max_length=64, verbose_name=u'Nome do local')
    categoria = models.ForeignKey(Categoria)
    endereco = models.CharField(max_length=64, verbose_name=u'Endereço')
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=10, decimal_places=8)
    complemento = models.CharField(max_length=16, nullable=True)
    ano_fundacao = models.PositiveIntegerField(verbose_name=u'Ano de fundação')
    descricao = models.TextField(verbose_name=u'Descrição', nullable=True)
    horario_funcionamento = models.CharField(max_length=128, nullable=True,
                                verbose_name=u'Horário de funcionamento')
    site = models.URLField(nullable=True)
    contatos = models.CharField(max_length=32, nullable=True)
    visivel = models.BooleanField(default=True, nullable=u'Visível')

    def __str__(self):
        return '%s - %s' % (self.nome, self.endereco)


class Foto(models.Model):
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_ultima_modificacao = models.DateTimeField(auto_now=True)

    descricao = models.CharField(max_length=64, nullable=True,
                    verbose_name=u'Descrição')
    imagem = models.ImageField(upload_to='fotos/%Y/%m')
