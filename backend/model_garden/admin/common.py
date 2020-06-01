from datetime import datetime
import re
from typing import Any, Dict, Optional

DATE_QUERY_REGEX = re.compile(
  r'(?P<compare>(?:<|>|<=|>=|=))\s*(?P<date>\d{1,2}/\d{1,2}/\d{2})',
  re.I,
)


def format_date(date_value: Optional[datetime]) -> str:
  if not date_value:
    return ''
  return date_value.strftime('%x')


def get_date_term(predicate: str, field: str, value: Any) -> Dict[str, Any]:
  if predicate == '<':
    term = {f'{field}__lt': value}
  elif predicate == '>':
    term = {f'{field}__gt': value}
  elif predicate == '<=':
    term = {f'{field}__lte': value}
  elif predicate == '>=':
    term = {f'{field}__gte': value}
  else:
    term = {field: value}

  return term


class FilterCreatedFixture:
  def filter_created(self, request, queryset, search_term):
    match = DATE_QUERY_REGEX.search(search_term)
    if not match:
      return queryset

    try:
      search_date = datetime.strptime(match.group('date'), '%m/%d/%y')
    except ValueError:
      return queryset

    return self.model.objects.filter(
      **get_date_term(match.group('compare'), 'created_at__date', search_date),
    )
