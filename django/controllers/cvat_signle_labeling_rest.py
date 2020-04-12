# Management of image/video labeling on single github.com/opencv/cvat instance.

import posixpath
import requests

from django.http import JsonResponse


def get_cvat_instance_url():
  # TODO: read intance urls from S3
  cvat_urls = ["http://localhost:7000"]

  return cvat_urls[0]


def cvat_login(request):
  # TODO: Take CVAT JSON config from S3
  response = requests.post(url=posixpath.join(get_cvat_instance_url(),
                                              'api/v1/auth/login'),
                           json={"username": "",
                                 "email": "@epam.com",
                                 "password": ""})
  request.session['csrf_token'] = response.cookies['csrftoken']
  request.session['cookies'] = response.cookies.get_dict()
  request.session['cvat_instance_url'] =  get_cvat_instance_url()

  return response


def add_labeling_task(request):
  if not request.session.get('cvat_instance_url'):
    login_response = cvat_login(request)
    if not login_response.ok:
      return JsonResponse([{'status': 'error', 'error': login_response.text}])

  response = requests.post(
    url=posixpath.join('http://localhost:7000', 'api/v1/tasks'),
    json = {"name":"NewTask",
            "owner": 1,
            "assignee": 2,
            "labels":[
              {"name":"newLabel",
               "attributes":[]
              }],
            "image_quality":70,
            "z_order": False,
            "segment_size":"1",
            "overlap":"1",
            "start_frame":"1",
            "stop_frame":"1",
            "frame_filter":"step=1"},
    headers={'content-type': 'application/json',
             'X-CSRFToken': request.session['csrf_token']},
    cookies=request.session['cookies'])
  if not response.ok:
    del request.session['cvat_instance_url']
    return JsonResponse({'status': 'error', 'error': response.text})

  return JsonResponse({'status': 'ok'}, safe=False)
