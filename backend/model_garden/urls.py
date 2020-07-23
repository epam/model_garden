"""model_garden URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include
from django.contrib import admin
from django.urls import path
from rest_framework import routers

from model_garden.views import (
  BucketViewSet,
  CvatUserViewSet,
  DatasetViewSet,
  HealthCheckView,
  LabelingTaskViewSet,
  MediaAssetViewSet,
)

router = routers.DefaultRouter()
router.register(r'buckets', BucketViewSet)
router.register(r'cvat-users', CvatUserViewSet, basename='cvatusers')
router.register(r'datasets', DatasetViewSet)
router.register(r'labeling-tasks', LabelingTaskViewSet)
router.register(r'media-assets', MediaAssetViewSet)

urlpatterns = [
  path('admin/', admin.site.urls),
  path('api/', include(router.urls)),
  path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
  path('health_check/', HealthCheckView.as_view()),
]
