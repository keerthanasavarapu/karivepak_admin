import React from 'react';

const SvgNewIcon = (props) => {
    const { iconId, ...res } = props;
    return (
        <>
            {/* <img {...res} src={`${process.env.PUBLIC_URL}/svg/${iconId}.svg`} /> */}
            <svg {...res}>
                <use href={`${process.env.PUBLIC_URL}/svg/${iconId}.svg`}></use>
            </svg>
        </>
    );
};

export default SvgNewIcon;
