import React, { Fragment, useState } from 'react';
import Charts from 'react-apexcharts';
import { Navigation } from 'react-feather';
import { Card, CardBody, CardHeader, Col, Row, Nav, NavItem } from 'reactstrap';
import { H5, Btn } from '../../../../AbstractElements';
import { DatePickers, Finance } from '../../../../Constant';
import { columnChart } from './ChartData';
import useShowClass from '../../../../Hooks/useShowClass';
import { DropdownCommon } from './CardWidgets';
import DatePicker from "react-datepicker";


const MonthlyChart = () => {
    const NavTab = ['Revenue', 'orders', 'Customers'];
    const DailyDropdown = ["Beer&Ciders", "Wines", "Spirits"];

    const [active, setActive] = useState('Revenue');
    const [show, setShow] = useShowClass('show');
    const activeHandler = (item) => {
        setActive(item);
        setShow('');
    };
    const [startDate, setstartDate] = useState(new Date())
    const handleChange = date => {
        setstartDate(date);
    };

    return (
        <Fragment>


        </Fragment>
    )
}

export default MonthlyChart;