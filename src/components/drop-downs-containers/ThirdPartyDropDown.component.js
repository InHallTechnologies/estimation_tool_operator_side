import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, TextField } from '@mui/material';
import './DropDownsContainer.styles.scss'
import { AiOutlineClose } from 'react-icons/ai';

export default function ThirdPartyDropDown({ value, setValue }) {
  const [age, setAge] = React.useState('');
  const [entryValue, setEntryValue] = React.useState("");
  var result = Object.keys(value.thirdPartySystem).map((key) => [key, value.thirdPartySystem[key]]);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleAdd = () => {
    setValue(value => ({...value, 
      thirdPartySystem: {
        ...value.thirdPartySystem, 
        [age]: parseInt(entryValue)
      }
    }))
    setAge("")
    setEntryValue("")
  }

  const removeSelected = (key) => {
    setValue(value => ({...value, 
      thirdPartySystem: {
        ...value.thirdPartySystem, 
        [key]: ""
      }
    }))
  }

  return (
    <>
      <div className='drop-down-container'>
      <FormControl className='first-element' focused variant="standard" >
        <label id="demo-simple-select-filled-label" style={{fontSize:'1.13rem', color:'#000000', fontWeight:'bold',marginBottom:'-23px', zIndex:'10'}}>Effort</label>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
          sx={{padding:1}}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={"p40Effort"}>40% effort</MenuItem>
          <MenuItem value={"p20Effort"}>20% effort</MenuItem>
          <MenuItem value={"p10Effort"}>10% effort</MenuItem>
        </Select>
        </FormControl>
        
        <FormControl className='second-element scale-up-center' focused variant="standard">
          <label style={{fontSize:'1.13rem', color:'#000000', fontWeight:'bold',marginBottom:'-23px', zIndex:'10'}}>3rd party systems</label>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={entryValue}
            onChange={event => setEntryValue(event.target.value)}
            sx={{padding:1}}
          >
            {
              [1,2,3,4,5]
              .map(item => <MenuItem value={item.toString()}>{item}</MenuItem>)
            }
          </Select>
        </FormControl>        
        <Button sx={{backgroundColor:'white', color:'#FE5C1C'}} variant="text" onClick={handleAdd} className='scale-up-center'>Add +</Button>
      </div>
      <div className='added-entry-list-container'>
        {
          result.map(item => {
            return (
              
                item[1]
                ?
                <div key={JSON.stringify(item)} className='added-entry-list-arch' onClick={_ => removeSelected(item[0])}>
                  <div className='added-entry-list-arch-content'>
                    <TextField sx={{padding:"4px",width:"100%", flex: 1}} value={item[1]} onChange={event => setEntryValue(event.target.value)} className='first-element scale-up-center added-entry-list-title'  variant={"standard"} focused label={item[0]} InputLabelProps={{style: {fontSize:'1.4rem', color:'#000000', fontWeight:'bold', backgroundColor:"white"}}} />
                    <AiOutlineClose size={20} className='delete-entry' />
                  </div>
                </div>
                :
                null
            )
          })
        }
      </div>
    </>
  );
}
