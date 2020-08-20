export interface TableStateProps {
  page: number;
  rowsPerPage: number;
  searchProps: any;
  filterStatus: FilterProps;
  sortOrder: 'ascend' | 'descend' | undefined;
  sortField: string | undefined;
}

type StatusFilters = 'annotation' | 'validation' | 'completed' | 'saved' | 'failed' | 'archived';

export interface FilterProps {
  filterStatus: StatusFilters[] | null;
}
