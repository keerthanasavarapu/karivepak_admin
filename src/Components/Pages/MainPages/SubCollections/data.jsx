import { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export const DropdownCommon = ({ dropdownMain, icon = true, iconName, btn, options }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    return (
        <>

            <Dropdown {...dropdownMain} isOpen={dropdownOpen} color='light' toggle={toggle} style={{ backgroundColor: '#fff', minWidth: '150px' }}>
                <DropdownToggle {...btn} size='sm' color='light' className='form-select text-dark bg-light'>
                    {icon && <i className={iconName} style={{}}></i>}
                    {!icon && options[0]}
                </DropdownToggle>
                <DropdownMenu>
                    {options.map((item, i) => (
                        <DropdownItem key={item.id}>{item.name}</DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

export const spinnerData = [{
    id: 33,
    heading: 'Loader 31',
    spinnerClass: 'loader-35'
}]
export const AlertSweetalertData = [
    {
        id: 1,
        color: 'success',
        class: 'sweet-8',
        name: 'alertSuccess',
        title: 'Success'
    },
    {
        id: 2,
        color: 'danger',
        class: 'sweet-7',
        name: 'alertDanger',
        title: 'Danger'
    },
    {
        id: 3,
        color: 'info',
        class: 'sweet-9',
        name: 'alertInfo',
        title: 'Information'
    },
    {
        id: 4,
        color: 'warning',
        class: 'sweet-6',
        name: 'alertWarning',
        title: 'Warning'
    },
];