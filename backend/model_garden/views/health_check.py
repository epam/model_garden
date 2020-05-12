from django.db import connection
from django.http import HttpResponse
from django.views import View


class HealthCheckView(View):
    """Check if the site is healthy."""
    def get(self, request, *args, **kwargs):
        with connection.cursor() as cursor:
            cursor.execute("select 1")
            one = cursor.fetchone()[0]
            if one != 1:
                raise Exception('The site did not pass the health check')
        return HttpResponse("ok")
