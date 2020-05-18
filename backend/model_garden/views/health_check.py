from django.http import HttpResponse
from django.views import View


class HealthCheckView(View):
    """Check if the site is healthy."""
    def get(self, request, *args, **kwargs):
        return HttpResponse("ok")
