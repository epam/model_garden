from typing import Iterable


def chunkify(arr: Iterable, n: int):
  for i in range(0, len(arr), n):
    yield arr[i:i + n]
