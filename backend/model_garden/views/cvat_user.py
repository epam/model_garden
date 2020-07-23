from django.conf import settings
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from model_garden.serializers import CvatUserSerializer
from model_garden.services.cvat import CvatService


class CvatUserViewSet(ViewSet):
  serializer_class = CvatUserSerializer

  def list(self, request):
    cvat_service = CvatService()
    # TODO: Implement and use username filter of CVAT API.
    users = [user for user in cvat_service.get_users() if user['username'] != settings.CVAT_ROOT_USER_NAME]
    serializer = CvatUserSerializer(users, many=True)
    return Response(serializer.data)
