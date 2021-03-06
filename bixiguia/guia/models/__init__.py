# coding: utf-8

from django.db import models
from sorl import thumbnail


from bixiguia.guia.models import mixins


class Categoria(mixins.DataMixin):
    nome = models.CharField(max_length=64, help_text=u'Ex.: Gastronomia')
    nome_slug = models.SlugField(max_length=64, unique=True,
                    verbose_name=u'Nome na URL')
    icon_index = models.PositiveIntegerField(null=True, blank=True,
                    verbose_name=u'Índice do ícone',
                    help_text=u'Não altere esse valor a não ser que saiba o que está fazendo')
    visivel = models.BooleanField(default=True, verbose_name=u'Visível')

    def __unicode__(self):
        return self.nome

    def natural_key(self):
        return self.nome

    def markers_sprite_offset(self):
        return -22 - (self.icon_index * 12)

    class Meta:
        ordering = ['nome', ]


class Local(mixins.DataMixin):
    nome = models.CharField(max_length=64, verbose_name=u'Nome do local',
                    help_text=u'Ex.: Cantina C Q Sabe')
    nome_slug = models.SlugField(max_length=64, unique=True,
                    verbose_name=u'Nome na URL',
                    help_text=u'Nome que irá aparecer na barra de endereços.<br>Ex.: Cantina C Q Sabe')

    categoria = models.ForeignKey(Categoria)

    endereco = models.CharField(max_length=64, verbose_name=u'Endereço',
                    help_text=u'Ex.: R. Conselheiro Ramalho, 800')
    complemento = models.CharField(max_length=16, blank=True,
                    help_text=u'Ex.: 14')

    latitude = models.DecimalField(max_digits=10, decimal_places=8,
                    help_text=u'Ex.: -23.50')
    longitude = models.DecimalField(max_digits=10, decimal_places=8,
                    help_text=u'Ex.: -46.50')

    ano_fundacao = models.PositiveIntegerField(null=True, blank=True,
                        verbose_name=u'Ano de fundação',
                        help_text=u'Ex.: 1950')
    descricao = models.TextField(verbose_name=u'Descrição', blank=True,
                    help_text=u'Escreva um texto descritivo com cerca de 500 caracteres sobre o local.')
    horario_funcionamento = models.CharField(max_length=128, blank=True,
                                verbose_name=u'Horário de funcionamento',
                                help_text=u'Ex.: Segunda a Quinta das 11h30 às 02h00')

    site = models.URLField(blank=True, verify_exists=False,
                    help_text=u'Ex.: http://www.bixiguia.com.br')
    contatos = models.CharField(max_length=32, blank=True,
                    help_text=u'Ex.: (11) 1234-5678')
    email = models.EmailField(blank=True, help_text=u'Ex.: bixiguia@bixiguia.com.br')
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
