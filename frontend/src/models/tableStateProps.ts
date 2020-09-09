type TStatusFilters = 'annotation' | 'validation' | 'completed' | 'saved' | 'failed' | 'archived';

export interface IFilterProps {
  filterStatus: TStatusFilters[] | null;
}

export interface ITableStateProps {
  page: number;
  rowsPerPage: number;
  searchProps: any;
  filterStatus: IFilterProps;
  sortOrder: 'ascend' | 'descend' | undefined;
  sortField: string | undefined;
}
