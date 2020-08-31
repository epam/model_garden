from django.contrib import admin

from model_garden.models import Bucket
from .common import FilterCreatedFixture, format_date


@admin.register(Bucket)
class BucketAdmin(admin.ModelAdmin, FilterCreatedFixture):
    date_hierarchy = 'created_at'
    list_display = ('id', 'created', 'name', 'url')
    list_filter = ('created_at', 'name')
    search_fields = ('id', 'name', 'url')

    def created(self, obj):
        return format_date(obj.created_at)

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)

        queryset |= self.filter_created(request, queryset, search_term)

        return queryset, use_distinct
