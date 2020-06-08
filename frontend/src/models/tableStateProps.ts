export interface TableStateProps {
  page: number;
  rowsPerPage: number;
  searchProps: any;
  filterStatus: Array<string> | null;
  sortOrder: 'ascend' | 'descend' | undefined;
  sortField: string | undefined;
}
