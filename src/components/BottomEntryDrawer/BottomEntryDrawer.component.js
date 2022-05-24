import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './BottomEntryDrawer.styles.css';
import { Alert, createTheme, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, ThemeProvider } from '@mui/material';
import ResourcesDropDown from '../drop-downs-containers/ResourcesDropDown.component';
import ThirdPartyDropDown from '../drop-downs-containers/ThirdPartyDropDown.component';
import mainEntry from '../../Entities/mainEntry';
import moment from 'moment';
import { ref, push, set } from 'firebase/database'
import { firebaseAuth, firebaseDatabase } from '../../backend/firebaseHandler';
import { handleFunctions } from '../../backend/handleAutoFill';
import { IoArrowBack } from 'react-icons/io5'
import UnEditableFields from '../UnEditableFields/UnEditableFields.component';
import { useNavigate } from 'react-router-dom';
import context from '../../context/app-context';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ff8f4c',
      main: '#F4F8F9',
      dark: '#c32500',
      contrastText: '#fff',
    },
    dark: {
      light: '#ff8f4c',
      main: '#black',
      dark: '#c32500',
      contrastText: '#fff',
    },
  },
});
const radioTheme = createTheme({
  palette: {
    primary: {
      light: '#ff8f4c',
      main: '#000',
      dark: '#c32500',
      contrastText: '#fff',
    },
  },
});


function BottomEntryDrawer({ buttonText, variant, entry }) {
  const [state, setState] = React.useState({bottom: false});
  const [newSystem, setNewSystem] = React.useState("Existing");
  const [sampleEntry, setSampleEntry] = React.useState({...mainEntry});
  const firebaseUser = firebaseAuth.currentUser;
  const [message, setMessage] = React.useState("")
  const [visibility, setVisibility] = React.useState(false)
  const [severityType, setSeverity] = React.useState("")
  const [user, setUser] = React.useContext(context)
  const navigate = useNavigate();

  React.useEffect(() => {
    if (entry) {
      setSampleEntry(entry);
      setNewSystem(entry.typeOfSystem);
    }
  }, [entry]) 

  const UseRecalibrate = (value) => {
    const tempValue = {...mainEntry, ...sampleEntry, numOfSystems: value}
    // Complexity and T-Shirt
    const systems = parseInt(tempValue.numOfSystems);
    if (systems >= 1 && systems <= 3) {
      tempValue.complexity = "Low" ;
      tempValue.tShirt = "Small";
    }else if (systems === 4 || systems === 5) {
      tempValue.complexity = "Medium";
      tempValue.tShirt = "Medium";
    }else if (systems >= 6 && systems <= 9) {
      tempValue.complexity = "High";
      tempValue.tShirt = "Large";
    }else if (systems >= 10) {
      tempValue.complexity = "Very High";
      tempValue.tShirt = "XL";
    }else {
      tempValue.complexity = "";
      tempValue.tShirt = "";
    }
    setSampleEntry(entry => ({...entry, ...tempValue}));
  }

  const handleRadio = event => {
    setNewSystem(event.target.value);
    if (event.target.value === "New") {
      setSampleEntry(entry => ({
        ...entry, 
        complexity: "High",
        tShirt: "Large",
        numOfSystems:""
      }));
    }else {
      setSampleEntry(entry => ({
        ...entry, 
        complexity: "",
        tShirt: "",
        numOfSystems:""
      }));
    }
    

  }
  
  
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    if (name === "numOfSystems") {
      UseRecalibrate(value);
    } else {
      setSampleEntry(entry => ({...entry, [name]: value}))
    }
    if (name === "numOfRequirements" || name === "numOfSystems" || name === "vendorResource" || name === "vendorRateGBP") {
      setSampleEntry(entry => ({...entry, [name]: value.replace(/[^0-9]/g, '')}))
    } 
  }

  const handleSubmit = async () => {
    if (sampleEntry.projectName === "") {
      setVisibility(true)
      setMessage("Please enter Project Name")
      setSeverity("warning")
      return
    }
    if (sampleEntry.numOfRequirements === "") {
      setVisibility(true)
      setMessage("Please enter Number of Requirements")
      setSeverity("warning")
      return
    }
    if (newSystem === "Existing" && sampleEntry.numOfSystems === "") {
      setVisibility(true)
      setMessage("Please enter Number of Systems")
      setSeverity("warning")
      return
    }
    if (sampleEntry.resources.l6 === "" && sampleEntry.resources.l5 === "" && sampleEntry.resources.l4 === "") {
      setVisibility(true)
      setMessage("Please select at least one Level and Resources")
      setSeverity("warning")
      return
    }
    // if (sampleEntry.thirdPartySystem.p40Effort === "" && sampleEntry.thirdPartySystem.p20Effort === "" && sampleEntry.thirdPartySystem.p10Effort === "") {
    //   setVisibility(true)
    //   setMessage("Please select at least one Effort and 3rd Party System")
    //   setSeverity("warning")
    //   return
    // }
    let tempSampleEntry = handleFunctions(sampleEntry)
    const entryKey = tempSampleEntry.key? tempSampleEntry.key : push(ref(firebaseDatabase, `ALL_ENTRIES_ARCHIVE/`)).key;
    tempSampleEntry = {
      ...tempSampleEntry,
      date: moment().format("Do MMMM YYYY"),
      time: moment().format("h:mm a"),
      key: entryKey,
      typeOfSystem:newSystem
    }
    const { date, time, key, operatorId, projectName, projectDescription, estimatedTime, estimatedTotalCost} = tempSampleEntry;


    let allEntriesRef = ref(firebaseDatabase, `ALL_ENTRIES_ARCHIVE/${entryKey}`);
    await set(allEntriesRef, tempSampleEntry);

    allEntriesRef = ref(firebaseDatabase, `ALL_ENTRIES_META_DATA/${entryKey}`);
    await set(allEntriesRef, {date, time, key, operatorId, projectName, projectDescription, estimatedTime, estimatedTotalCost});

    allEntriesRef = ref(firebaseDatabase, `OPERATOR_WISE_ENTRIES_ARCHIVE/${firebaseUser.uid}/${entryKey}`);
    await set(allEntriesRef, tempSampleEntry);
    
    if (!entry) {
      setSampleEntry({...mainEntry})
    }

    setState({bottom:false});
    navigate(`/${key}`)
  }

  const handleButton = () => {
    if (user.status === "NEW") {
      alert("New")
    } else if (user.status === "ACTIVE") {
      console.log("here")
      toggleDrawer('bottom', true)
    } else {
      alert("Disabled")
    }
  }

  return (
    <div className='bottom-entry-drawer-container'>
      <React.Fragment>
          <Button sx={{backgroundColor:'#FE5C1C'}} variant={'contained'} onClick={toggleDrawer('bottom', true)}>
            {
              buttonText
              ?
              buttonText
              :
              "New Estimation +"
            }
          </Button>
          <Drawer
            anchor={"bottom"}
            open={state["bottom"]}
            onClose={toggleDrawer("bottom", false)}>
            <div className='bottom-entry-content'>
              <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                <IoArrowBack size={20} onClick={toggleDrawer('bottom', false)} color="#FE5C1C" style={{marginBottom:20, marginRight:10, cursor:'pointer'}} />
                <h2 className='slider-headline'>
                  {
                    entry
                    ?
                    "Edit Estimation"
                    :
                    "New Estimation"
                  }
                </h2>
              </div>
              
              <div className='name-desc-container'>
                <TextField onChange={handleChange} name='projectName' value={sampleEntry.projectName}   label="Project Name" variant={"standard"} focused InputLabelProps={{style: {fontSize:'1.4rem', color:'#000000', fontWeight:'bold', zIndex:'10'}}} />
                <TextField focused onChange={handleChange} name='projectDescription' value={sampleEntry.projectDescription} sx={{width:'100%'}}  label="Project Description (Optional)" variant={"standard"} InputLabelProps={{style: {fontSize:'1.4rem', color:'#000000', fontWeight:'bold'}}} />
                <TextField onChange={handleChange} name='numOfRequirements' value={sampleEntry.numOfRequirements}   label="Requirements" variant={"standard"} focused InputLabelProps={{style: {fontSize:'1.4rem', color:'#000000', fontWeight:'bold', zIndex:'10'}}} />
              </div>
             
              <div className='entry-content'>
                <ThemeProvider theme={radioTheme}>
                  <FormControl>
                    <label style={{fontSize:'1.13rem', color:'#000000', fontWeight:'bold',marginBottom:'-23px', zIndex:'10'}}>Type of system</label>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="New"
                      name="radio-buttons-group"
                      row
                      onChange={handleRadio}
                      value={newSystem}
                      sx={{marginTop:'30px', backgroundColor:'#F4F8F9', padding:"0px"}}
                    >
                      <FormControlLabel value="Existing" control={<Radio />} label="Existing" />
                      <FormControlLabel value="New" control={<Radio />} label="New" />
                    </RadioGroup>
                  </FormControl>
                </ThemeProvider>
                
                {
                  newSystem === 'Existing'
                  ?
                  <TextField onChange={handleChange} name='numOfSystems' value={sampleEntry.numOfSystems} className='scale-up-center'   label="Systems" variant={"standard"} focused InputLabelProps={{style: {fontSize:'1.4rem', color:'#000000', fontWeight:'bold', zIndex:'10'}}} />
                  :
                  <br />
                }
                <UnEditableFields value={sampleEntry.complexity} title="Complexity" />
                <UnEditableFields value={sampleEntry.tShirt}   title="T Shirts" />
              </div>
              <Divider sx={{margin:'20px 0'}} />
              <div className='drop-down-main-container'>
                <div className='drop-downs-container'>
                    <ResourcesDropDown value={sampleEntry} setValue={setSampleEntry} />
                </div>
                {/* <Divider sx={{margin:'20px 0'}} /> */}
                
                <div className='drop-downs-container left-border'>
                    <ThirdPartyDropDown value={sampleEntry} setValue={setSampleEntry} />
                </div>
              </div>
                
              <Divider sx={{margin:'20px 0'}} />
              <div className='entry-content'>
                <TextField value={sampleEntry.vendorResource} onChange={handleChange} name="vendorResource" label="Vendor Resource" variant={"standard"} focused InputLabelProps={{style: {fontSize:'1.4rem', color:'#000000', fontWeight:'bold'}}} />
                <TextField value={sampleEntry.vendorRateGBP} onChange={handleChange} name="vendorRateGBP" label="Vendor Rate (GBP per Day)" variant={"standard"} focused InputLabelProps={{style: {fontSize:'1.4rem', color:'#000000', fontWeight:'bold'}}} />
              </div>
              
              <div className='form-action-container'>
                <Button onClick={toggleDrawer('bottom', false)} sx={{marginTop:'40px', minWidth:'200px', backgroundColor:'#FFECE4', color:'#FE5C1C'}} variant={'text'}>Cancel</Button>
                <Button onClick={handleSubmit} sx={{marginTop:'40px', minWidth:'200px', marginLeft:'10px', backgroundColor:'#FE5C1C'}} variant="contained">Get Estimate</Button>
              </div>
              
            </div>
            <Snackbar anchorOrigin={{vertical:'top', horizontal:'right'}} open={visibility} autoHideDuration={3000} onClose={()=>{setVisibility(false)}}>
                <Alert onClose={()=>{setVisibility(false)}} severity={severityType} sx={{ width: '100%' }}>{message}</Alert>
            </Snackbar>
          </Drawer>
        </React.Fragment>
    </div>
  );
}


export default ({buttonText, variant, entry}) => {
  return(
    <ThemeProvider theme={theme}>
      <BottomEntryDrawer buttonText={buttonText} variant={variant} entry={entry}/>
    </ThemeProvider>
  )
}