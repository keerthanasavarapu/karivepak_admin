import React, { Fragment, useCallback, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Btn, H4 } from '../../../AbstractElements';
import { dummytabledata, tableColumns } from '../../../Data/Table/Defaultdata';

const DataTableComponent = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleDelet, setToggleDelet] = useState(false);
    const [data, setData] = useState(dummytabledata);

    const handleRowSelected = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
            setToggleDelet(!toggleDelet);

            setData(data.filter((item) => selectedRows.filter((elem) => elem.id === item.id).length > 0 ? false : true));
            setSelectedRows('');
        }
    };

    return (
        <Fragment>
            <DataTable
                data={data}
                columns={tableColumns}
                striped={true}
                center={true}
                pagination
                clearSelectedRows={toggleDelet}
            />
        </Fragment>
    )
}
export default DataTableComponent