# Generated by Django 5.0.6 on 2024-05-12 04:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("game", "0003_remove_post_likes_post_likes"),
    ]

    operations = [
        migrations.RemoveField(model_name="post", name="likes",),
    ]
