#!/usr/bin/env python
import logging
import os
import time

from django import setup
from django.conf import settings
from django.core import management

logger = logging.getLogger(__name__)


if __name__ == "__main__":
  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'model_garden.settings')
  setup()

  while True:
    try:
      management.call_command('process_task_statuses')
    except Exception as e:
      logger.error(f"Failed to process task statuses: {e}")

    time.sleep(settings.TASK_STATUSES_WORKER_PERIOD)
