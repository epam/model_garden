export const TASK_STATUSES_COLUMNS = [
    {
        name: 'assignee',
        label: 'User Name'
    },
    {
        name: 'name',
        label: 'Task Name'
    },
    {
        name: 'cvat',
        label: 'CVAT Instance'
    },
    {
        name: 'status',
        label: 'Status'
    },
];

export const TASK_STATUSES = [
    { assignee: 'Joe James', name: 'First task', cvat: '-', status: 'not completed' },
    { assignee: 'John Walsh', name: 'Test Corp', cvat: '-', status: 'completed' },
    { assignee: 'Bob Herm', name: 'Test Corp', cvat: '-', status: 'not completed' },
    { assignee: 'James Houston', name: 'Test Corp', cvat: '-', status: 'not completed' },
];

export const TABLE_TITLE = 'Task Statuses';