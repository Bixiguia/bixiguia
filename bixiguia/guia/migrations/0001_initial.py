# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Categoria'
        db.create_table('guia_categoria', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('data_criacao', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('data_ultima_modificacao', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('nome', self.gf('django.db.models.fields.CharField')(max_length=64)),
            ('nome_slug', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=64)),
            ('visivel', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('guia', ['Categoria'])

        # Adding model 'Local'
        db.create_table('guia_local', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('data_criacao', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('data_ultima_modificacao', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('nome', self.gf('django.db.models.fields.CharField')(max_length=64)),
            ('nome_slug', self.gf('django.db.models.fields.SlugField')(unique=True, max_length=64)),
            ('categoria', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['guia.Categoria'])),
            ('endereco', self.gf('django.db.models.fields.CharField')(max_length=64)),
            ('complemento', self.gf('django.db.models.fields.CharField')(max_length=16, blank=True)),
            ('latitude', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=8)),
            ('longitude', self.gf('django.db.models.fields.DecimalField')(max_digits=10, decimal_places=8)),
            ('ano_fundacao', self.gf('django.db.models.fields.PositiveIntegerField')(null=True, blank=True)),
            ('descricao', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('horario_funcionamento', self.gf('django.db.models.fields.CharField')(max_length=128, blank=True)),
            ('site', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('contatos', self.gf('django.db.models.fields.CharField')(max_length=32, blank=True)),
            ('email', self.gf('django.db.models.fields.EmailField')(max_length=75, blank=True)),
            ('visivel', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('guia', ['Local'])

        # Adding model 'Foto'
        db.create_table('guia_foto', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('data_criacao', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('data_ultima_modificacao', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('posicao', self.gf('django.db.models.fields.SmallIntegerField')()),
            ('local', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['guia.Local'])),
            ('titulo', self.gf('django.db.models.fields.CharField')(max_length=64, blank=True)),
            ('imagem', self.gf('sorl.thumbnail.fields.ImageField')(max_length=100)),
            ('visivel', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('guia', ['Foto'])

        # Adding unique constraint on 'Foto', fields ['posicao', 'local']
        db.create_unique('guia_foto', ['posicao', 'local_id'])

        # Adding model 'Video'
        db.create_table('guia_video', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('data_criacao', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('data_ultima_modificacao', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('posicao', self.gf('django.db.models.fields.SmallIntegerField')()),
            ('local', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['guia.Local'])),
            ('titulo', self.gf('django.db.models.fields.CharField')(max_length=64, blank=True)),
            ('url', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('visivel', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('guia', ['Video'])

        # Adding unique constraint on 'Video', fields ['posicao', 'local']
        db.create_unique('guia_video', ['posicao', 'local_id'])


    def backwards(self, orm):
        # Removing unique constraint on 'Video', fields ['posicao', 'local']
        db.delete_unique('guia_video', ['posicao', 'local_id'])

        # Removing unique constraint on 'Foto', fields ['posicao', 'local']
        db.delete_unique('guia_foto', ['posicao', 'local_id'])

        # Deleting model 'Categoria'
        db.delete_table('guia_categoria')

        # Deleting model 'Local'
        db.delete_table('guia_local')

        # Deleting model 'Foto'
        db.delete_table('guia_foto')

        # Deleting model 'Video'
        db.delete_table('guia_video')


    models = {
        'guia.categoria': {
            'Meta': {'ordering': "['nome']", 'object_name': 'Categoria'},
            'data_criacao': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data_ultima_modificacao': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
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