import React from "react";

export const TASK_STATUSES_COLUMNS = [
    {
        name: 'name',
        label: 'Task Name'
    },
    {
        name: 'dataset',
        label: 'Dataset'
    },
    {
        name: 'labeler',
        label: 'Labeler'
    },
    {
        name: 'url',
        label: 'Url',
        options: {
            customBodyRender: (value: string) => {
                let hostname = value;
                let res = /https?:\/\/(.+?)\/.*/.exec(value);
                if (res && res.length === 2) {
                    hostname = res[1];
                }
                return (
                    <a href={value} target="_blank" rel="noopener noreferrer">{hostname}</a>
                );
            }
        }
    },
    {
        name: 'status',
        label: 'Status'
    },
];

export const TABLE_TITLE = 'Task Statuses';
