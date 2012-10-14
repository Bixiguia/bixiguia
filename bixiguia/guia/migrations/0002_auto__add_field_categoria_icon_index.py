# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Categoria.icon_index'
        db.add_column('guia_categoria', 'icon_index',
                      self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Categoria.icon_index'
        db.delete_column('guia_categoria', 'icon_index')


    models = {
        'guia.categoria': {
            'Meta': {'ordering': "['nome']", 'object_name': 'Categoria'},
            'data_criacao': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data_ultima_modificacao': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'icon_index': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nome': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'nome_slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '64'}),
            'visivel': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        'guia.foto': {
            'Meta': {'ordering': "['-data_criacao']", 'unique_together': "(['posicao', 'local'],)", 'object_name': 'Foto'},
            'data_criacao': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data_ultima_modificacao': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'imagem': ('sorl.thumbnail.fields.ImageField', [], {'max_length': '100'}),
            'local': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['guia.Local']"}),
            'posicao': ('django.db.models.fields.SmallIntegerField', [], {}),
            'titulo': ('django.db.models.fields.CharField', [], {'max_length': '64', 'blank': 'True'}),
            'visivel': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        'guia.local': {
            'Meta': {'object_name': 'Local'},
            'ano_fundacao': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True', 'blank': 'True'}),
            'categoria': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['guia.Categoria']"}),
            'complemento': ('django.db.models.fields.CharField', [], {'max_length': '16', 'blank': 'True'}),
            'contatos': ('django.db.models.fields.CharField', [], {'max_length': '32', 'blank': 'True'}),
            'data_criacao': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data_ultima_modificacao': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'descricao': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'endereco': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'horario_funcionamento': ('django.db.models.fields.CharField', [], {'max_length': '128', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '8'}),
            'longitude': ('django.db.models.fields.DecimalField', [], {'max_digits': '10', 'decimal_places': '8'}),
            'nome': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'nome_slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '64'}),
            'site': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'visivel': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        },
        'guia.video': {
            'Meta': {'ordering': "['-data_criacao']", 'unique_together': "(['posicao', 'local'],)", 'object_name': 'Video'},
            'data_criacao': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data_ultima_modificacao': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'local': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['guia.Local']"}),
            'posicao': ('django.db.models.fields.SmallIntegerField', [], {}),
            'titulo': ('django.db.models.fields.CharField', [], {'max_length': '64', 'blank': 'True'}),
            'url': ('django.db.models.fields.URLField', [], {'max_length': '200'}),
            'visivel': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        }
    }

    complete_apps = ['guia']