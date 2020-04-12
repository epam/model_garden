from controllers import cvat_signle_labeling_rest

from django.contrib import admin
from django.urls import re_path
from django.urls import path

from django.views.generic.base import RedirectView


urlpatterns = [
  re_path(r'^$', RedirectView.as_view(url='/admin')),
  path('admin/', admin.site.urls),
  path('cvat/instance/add/labeling/task',
       cvat_signle_labeling_rest.add_labeling_task),
]
