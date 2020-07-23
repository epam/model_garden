from django.http import HttpResponse
from django.views import View
from rest_framework import status

from model_garden.services import CvatService


class HealthCheckView(View):
    """Check if the site is healthy."""
    def get(self, request, *args, **kwargs):
        if request.GET.get('cvat', 'false').lower() == 'true':
            try:
                CvatService()
            except Exception as e:
                return HttpResponse(
                    content=f"Failed to connect to CVAT: {e}",
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return HttpResponse("ok")
