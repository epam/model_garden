# Generated by Django 3.0.6 on 2020-08-10 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('model_garden', '0023_auto_20200810_0323'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataset',
            name='dataset_format',
            field=models.CharField(choices=[('VOC', 'Pascal VOC'), ('YOLO', 'YOLO')], default='VOC', max_length=16),
        ),
    ]
