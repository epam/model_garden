import os

import environ
from django import setup
from django.conf import settings
from django.contrib.auth import get_user_model

env = environ.Env()
dot_env_file_path = '.env'
if os.path.exists(dot_env_file_path):
    environ.Env.read_env(dot_env_file_path)

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'model_garden.settings')
    setup()

    username = settings.DJANGO_ROOT_USER
    email = settings.DJANGO_ROOT_EMAIL
    password = settings.DJANGO_ROOT_PASSWORD

    if username is not None and email is not None and password is not None:
        User = get_user_model()

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username, email, password)
