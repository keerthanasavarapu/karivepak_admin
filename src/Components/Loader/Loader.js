import React from 'react'
import { Col } from 'reactstrap'
import { Spinner } from '../../AbstractElements'

function Loader() {

    const spinnerData = [{
        id: 33,
        heading: 'Loader 31',
        spinnerClass: 'loader-35'
    }]

    return (
        <>
            {
                spinnerData.map((spinner) =>
                    <Col xxl="12" key={spinner.id} className='flex justify-center items-center'>
                        <div className="loader-box">
                            <Spinner attrSpinner={{ className: spinner.spinnerClass }} />
                        </div>
                    </Col>
                )
            }
        </>
    )
}

export default Loader
