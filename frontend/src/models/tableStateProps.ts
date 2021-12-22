type TStatusFilters = 'annotation' | 'validation' | 'completed' | 'saved' | 'failed' | 'archived';

type TSortOrder = 'ascend' | 'descend' | undefined;

interface ISearchProps {
  name?: string;
  dataset_id?: string;
  dataset?: string;
  labeler?: string;
}

export interface IFilterProps {
  filterStatus: TStatusFilters[] | null;
}

export interface ITableStateProps {
  page: number;
  rowsPerPage: number;
  searchProps: ISearchProps;
  filterStatus: IFilterProps;
  sortOrder: TSortOrder;
  sortField: string | undefined;
}

export interface IMappedTableParams extends ISearchProps {
  page: number;
  page_size: number;
  status: IFilterProps;
  ordering: string | undefined;
}
