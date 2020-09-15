import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Input, Button } from 'antd';

interface IGetColumnSearchProps {
  filterDropdown: any;
  filterIcon: any;
  onFilter: any;
  onFilterDropdownVisibleChange: any;
  render: any;
}

export const GetColumnSearchProps = (
  dataIndex: string,
  updateSearchState: Function,
  resetSearchState: Function
): IGetColumnSearchProps => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  let searchInput: Input | null;

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
    resetSearchState();
  };

  const handleSearch = (
    selectedKeys: Array<string>,
    confirm: any,
    paramDataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(paramDataIndex);

    updateSearchState({
      [paramDataIndex]: selectedKeys[0]
    });
  };
  const SearchOutlinedComp = Object.assign(
    (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    { displayName: 'SearchOutlinedComp' }
  );

  const HighlighterComp = Object.assign(
    (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
    { displayName: 'HighlighterComp' }
  );

  const FilterDropdownComp = Object.assign(
    ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div className="search">
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          className="search__input"
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          className="search__button"
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          className="search__button"
        >
          Reset
        </Button>
      </div>
    ),
    { displayName: 'FilterDropdownComp' }
  );

  return {
    filterDropdown: FilterDropdownComp,
    filterIcon: SearchOutlinedComp,
    onFilter: (value: string, record: any) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput && searchInput.select());
      }
    },
    render: HighlighterComp
  };
};
