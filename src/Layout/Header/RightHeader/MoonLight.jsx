import React, { useContext, useState } from 'react';
import SvgIcon from '../../../Components/Common/Component/SvgIcon';
import CustomizerContext from '../../../_helper/Customizer';
import { Input, Label, Media } from 'reactstrap';

const MoonLight = () => {
  const { addMixBackgroundLayout } = useContext(CustomizerContext);
  const mix_background_layout = localStorage.getItem('mix_background_layout');
  const [moonlight, setMoonlight] = useState(mix_background_layout === 'dark-only' ? true : false);

  const MoonlightToggle = (light) => {
    if (light) {
      addMixBackgroundLayout('light-only');
      document.body.className = 'light-only';
      setMoonlight(!light);
    } else {
      addMixBackgroundLayout('dark-only');
      document.body.className = 'dark-only';
      setMoonlight(!light);
    }
  };

  const handleDarkMode = (event) => {
    if(event.target.checked){
      addMixBackgroundLayout('dark-only');
      document.body.className = 'dark-only';
      setMoonlight(true);
    }
    else {
      addMixBackgroundLayout('light-only');
      document.body.className = 'light-only';
      setMoonlight(false);
    }
  }

  return (
    <>
      {/* <li>
        <div className={`mode ${moonlight && 'active'}`} onClick={() => MoonlightToggle(moonlight)}>
          <SvgIcon iconId={'moon'} />
        </div>
      </li> */}

      <Media className='product_switch'>
        <Media body className='switch-sm' >
          <Label className="switch">
            <Input type="checkbox" checked={moonlight} onChange={(e) => handleDarkMode(e)} /><span className={`switch-state`} ></span>
          </Label>
        </Media>
      </Media>
      
    </>
  );
};

export default MoonLight;
