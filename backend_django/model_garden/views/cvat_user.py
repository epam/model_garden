from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from model_garden.serializers import CvatUserSerializer

from model_garden.services.cvat import CvatService


class CvatUserViewSet(ViewSet):
  serializer_class = CvatUserSerializer

  def list(self, request):
    cvat_service = CvatService()
    serializer = CvatUserSerializer(cvat_service.get_users(), many=True)
    return Response(serializer.data)
