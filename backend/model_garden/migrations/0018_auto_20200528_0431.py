# Generated by Django 3.0.6 on 2020-05-28 04:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('model_garden', '0017_auto_20200522_1904'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bucket',
            options={'ordering': ('-created_at',)},
        ),
        migrations.AlterModelOptions(
            name='dataset',
            options={'ordering': ('-created_at',)},
        ),
        migrations.AlterModelOptions(
            name='labeler',
            options={'ordering': ('-created_at',)},
        ),
        migrations.AlterModelOptions(
            name='labelingtask',
            options={'ordering': ('-created_at',)},
        ),
    ]
