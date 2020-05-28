import logging
from typing import Optional, List
from time import sleep

import requests
from django.conf import settings
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from model_garden.constants import AnnotationsFormat

logger = logging.getLogger(__name__)


class CVATServiceException(Exception):
  pass


class CvatService:

  def __init__(self):
    self._adapter = HTTPAdapter(
      max_retries=Retry(
        total=3,
        backoff_factor=0.1,
      ),
    )
    self._session = requests.Session()
    self._session.mount("http://", adapter=self._adapter)
    self._session.mount("https://", adapter=self._adapter)
    self._authenticate()

  def _get_url(self, path: str) -> str:
    return f"{settings.CVAT_API_URL}/{path}"

  def _request(self, method: str, path: str, params: dict = None, data: dict = None) -> requests.Response:
    url = self._get_url(path)

    response = None
    try:
      response = getattr(self._session, method)(url=url, params=params, json=data)
      try:
        response.raise_for_status()
      except requests.HTTPError as e:
        raise CVATServiceException(f"Request to '{url}' failed ({e}): {response.content}")
    finally:
      msg = f'"{method.upper()} {url}"'
      if response is not None:
        msg += f' {response.status_code} {len(response.content)}'

      if method == 'post':
        msg += f' {data}'

      logger.info(msg)

    return response

  def _get(self, path: str, params: Optional[dict] = None) -> requests.Response:
    return self._request(method='get', path=path, params=params)

  def _post(self, path: str, data: dict) -> requests.Response:
    return self._request(method='post', path=path, data=data)

  def _authenticate(self):
    response = self._post(
      path='auth/login',
      data={
        'username': settings.CVAT_ROOT_USER_NAME,
        'password': settings.CVAT_ROOT_USER_PASSWORD,
      },
    )
    self._session.headers.update({'X-CSRFToken': self._session.cookies['csrftoken']})
    return response

  def get_root_user(self):
    for user in self.get_users():
      if user['username'] == settings.CVAT_ROOT_USER_NAME:
        return user

    raise RuntimeError(f"Failed to find root CVAT user: {settings.CVAT_ROOT_USER_NAME}")

  def get_users(self):
    response = self._get('users')
    return response.json()['results']

  def get_user(self, user_id: int):
    response = self._get(f'users/{user_id}')
    return response.json()

  def create_task(
    self,
    name: str,
    assignee_id: int,
    owner_id: int,
    remote_files: List,
    labels: Optional[List] = None,
    image_quality: Optional[int] = 70,
  ) -> dict:
    if labels is None:
      labels = [
        {
          "name": "newLabel",
          "attributes": [],
        },
      ]

    response = self._post(
      path='tasks',
      data={
        "name": name,
        "owner": owner_id,
        "assignee": assignee_id,
        "bug_tracker": "",
        "overlap": None,
        "segment_size": "10",
        "z_order": False,
        "labels": labels,
        "image_quality": image_quality,
        "start_frame": 0,
        "stop_frame": 0,
        "frame_filter": "step=1",
        "project": None,
      },
    )
    task = response.json()

    response = self._post(
      path=f"tasks/{task['id']}/data",
      data={
        'remote_files': remote_files,
      },
    )
    task['data'] = response.json()
    return task

  def get_task(self, task_id: int) -> dict:
    response = self._get(f'tasks/{task_id}')
    return response.json()

  def get_annotations(
    self,
    task_id: int,
    task_name: str,
    annotation_format: Optional[str] = AnnotationsFormat.PASCAL_VOB_ZIP_1_1,
  ) -> bytes:
    tries = 10
    while tries:
      response = self._get(
        path=f'tasks/{task_id}/annotations/{task_name}',
        params={
          'format': annotation_format,
          'action': 'download',
        },
      )
      if response.status_code == 200:
        return response.content

      sleep(0.5)
      tries -= 1

    raise CVATServiceException(f"Failed to get annotations [{response.status_code}]: {response.content}")
