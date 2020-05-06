from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from model_garden.serializers import TaskSerializer
from model_garden.services.cvat import CvatService, CVATServiceException


class TaskViewSet(ViewSet):
  serializer_class = TaskSerializer

  def create(self, request):
    cvat_service = CvatService()
    serializer = self.serializer_class(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.data
    try:
      cvat_service.create_task(
        name=data['task_name'],
        assignee_id=data['assignee_id'],
        owner_id=cvat_service.get_root_user()['id'],
      )
    except CVATServiceException as e:
      return Response(data={'message': str(e)}, status=400)

    return Response()
