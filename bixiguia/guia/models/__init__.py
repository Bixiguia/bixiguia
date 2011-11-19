# coding: utf-8

from django.db import models
from sorl import thumbnail


from bixiguia.guia.models import mixins


class Categoria(mixins.DataMixin):
    nome = models.CharField(max_length=64)
    nome_slug = models.SlugField(max_length=64, unique=True,
                    verbose_name=u'Nome na URL')
    visivel = models.BooleanField(default=True, verbose_name=u'Visível')

    def __unicode__(self):
        return self.nome

    def natural_key(self):
        return self.nome

    class Meta:
        ordering = ['nome', ]


class Local(mixins.DataMixin):
    nome = models.CharField(max_length=64, verbose_name=u'Nome do local')
    nome_slug = models.SlugField(max_length=64, unique=True,
                    verbose_name=u'Nome na URL')

    categoria = models.ForeignKey(Categoria)

    endereco = models.CharField(max_length=64, verbose_name=u'Endereço')
    complemento = models.CharField(max_length=16, blank=True)

    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=10, decimal_places=8)

    ano_fundacao = models.PositiveIntegerField(null=True, blank=True,
                        verbose_name=u'Ano de fundação')
    descricao = models.TextField(verbose_name=u'Descrição', blank=True)
    horario_funcionamento = models.CharField(max_length=128, blank=True,
                                verbose_name=u'Horário de funcionamento')

    site = models.URLField(blank=True, verify_exists=False)
    contatos = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
    visivel = models.BooleanField(default=True, verbose_name=u'Visível')

    def __unicode__(self):
        return '%s - %s' % (self.nome, self.endereco)

    def fotos_visiveis(self):
        return self.foto_set.filter(visivel=True).order_by('posicao')

    def videos_visiveis(self):
        return self.video_set.filter(visivel=True).order_by('posicao')

    class Meta:
        verbose_name_plural = u'Locais'


class Foto(mixins.OrdemMixin, mixins.DataMixin):
    local = models.ForeignKey(Local)
    titulo = models.CharField(max_length=64, blank=True,
                    verbose_name=u'Título')

    imagem = thumbnail.ImageField(upload_to='fotos/locais/%Y/%m')
    visivel = models.BooleanField(default=True, verbose_name=u'Visível')

    def __unicode__(self):
        if self.titulo:
            return self.titulo

        return u'Foto sem descrição'

    class Meta:
        ordering = ['-data_criacao', ]
        unique_together = ['posicao', 'local']


class Video(mixins.OrdemMixin, mixins.DataMixin):
    local = models.ForeignKey(Local)
    titulo = models.CharField(max_length=64, blank=True,
                    verbose_name=u'Título')
    url = models.URLField(verify_exists=False)
    visivel = models.BooleanField(default=True, verbose_name=u'Visível')

    def __unicode__(self):
        return u'Vídeo %s' % self.url

    class Meta:
        ordering = ['-data_criacao', ]
        unique_together = ['posicao', 'local']
