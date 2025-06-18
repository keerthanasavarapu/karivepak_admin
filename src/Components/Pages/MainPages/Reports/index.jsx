import React, {  Suspense, lazy } from 'react';
import { Loader } from 'react-feather';
const ReportsComponent = lazy(() => import("./Reports"));

const Reports = () => {
    return (
        <>
            <Suspense fallback={<Loader />}>
                <ReportsComponent />
            </Suspense>
        </>
    )
}

export default Reports;