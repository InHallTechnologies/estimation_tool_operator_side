import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EffortsArch from '../../components/EffortsArch/EffortsArch.component';
import HomeNavigation from '../../components/HomeNavigation/HomeNavigation.component';
import ResultsArch from '../../components/ResultArch/ResultsArch.component';
import TopOverview from '../../components/TopOverview/TopOverview.component';
import './estimationDetails.styles.scss';
import { firebaseAuth, firebaseDatabase } from '../../backend/firebaseHandler'
import { onValue, ref } from 'firebase/database';
import { Button, CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';
import './estimationDetailsDesign2.styles.scss'
import BottomEntryDrawerComponent from '../../components/BottomEntryDrawer/BottomEntryDrawer.component';

const EstimationDetails = () => {
    const params = useParams();
    const firebaseUser = firebaseAuth.currentUser;
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        const entryReference = ref(firebaseDatabase, `OPERATOR_WISE_ENTRIES_ARCHIVE/${firebaseUser.uid}/${params.estimationId}`);
        onValue(entryReference, snapshot => {
            if (snapshot.exists()) {
                const entry = snapshot.val();
                const effortsArray = [];
                effortsArray.push({title:"Total hours to develop ", value: entry.hoursTo.developPerRequirement * parseInt(entry.numOfRequirements)})
                effortsArray.push({title:"Total hours to perform test ", value: entry.hoursTo.performTestPerRequirement * parseInt(entry.numOfRequirements)})
                effortsArray.push({title:"Total hours to perform design ", value: entry.hoursTo.performDesignPerRequirement * parseInt(entry.numOfRequirements)})
                effortsArray.push({title:"Total hours to perform PM ", value: entry.hoursTo.performPMperRequirement * parseInt(entry.numOfRequirements)})
                effortsArray.push({title:"Total hours to perform BA ", value: entry.hoursTo.performBAperRequirement * parseInt(entry.numOfRequirements)})
                if (entry.hoursTo.p40thirdPartyVendorPerRequirement !== 0) {
                    effortsArray.push({title:"Total hours for 3rd Party Vendor (40%)", value: entry.hoursTo.p40thirdPartyVendorPerRequirement * parseInt(entry.numOfRequirements)})
                }
                if (entry.hoursTo.p20thirdPartyVendorPerRequirement !== 0) {
                    effortsArray.push({title:"Total hours for 3rd Party Vendor (20%)", value: entry.hoursTo.p20thirdPartyVendorPerRequirement * parseInt(entry.numOfRequirements)})
                }
                if (entry.hoursTo.p10thirdPartyVendorPerRequirement !== 0) {
                    effortsArray.push({title:"Total hours for 3rd Party Vendor (10%)", value: entry.hoursTo.p10thirdPartyVendorPerRequirement * parseInt(entry.numOfRequirements)})
                }
                entry.effortsArray = effortsArray;
                setEntry(entry);
            }
        })
    }, [])

    function numberWithCommas(x) {
        return parseFloat(x).toLocaleString('en-IN');
    }

    if (!entry) {
        return (
            <div style={{width:'100%', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className={"estimationDetailsContainer"}>
            <HomeNavigation hideSearchBar showBack />
            <div className="estimationDetailsContent">
                <div className="leftPane">
                    <div className='editEntryContainer'>
                        <h2 className='project-name'>{entry.projectName}</h2>
                        <BottomEntryDrawerComponent buttonText={"Edit Estimation"}  variant="Edit" entry={entry}/>
                    </div>

                    <p className='project-details'>{entry.projectDescription}</p>
                    <div className='projectMainDetailsContainer'>
                        <TopOverview 
                            title={"General"} 
                            color="#FF5858"
                            objects={[{value:entry.numOfRequirements, title:'Requirements'}, {value:entry.numOfSystems?entry.numOfSystems:"New", title:'Systems'}, {value:entry.complexity, title:'Complexity'}, {value: entry.tShirt, title:'T-Shirt'}]}
                        />
                        <TopOverview 
                            title={"Resources"} 
                            color="#FBBC05"
                            objects={[{value: entry.resources.l6?entry.resources.l6:"", title:entry.resources.l6?'L-6':""}, {value: entry.resources.l5?entry.resources.l5:"", title:entry.resources.l5?'L-5':""}, {value: entry.resources.l4?entry.resources.l4:"", title:entry.resources.l4?'L-4':""}]}
                        />
                        <TopOverview 
                            title={"Third Party Systems"} 
                            color="#58FF69"
                            objects={[{value:entry.thirdPartySystem.p40Effort?entry.thirdPartySystem.p40Effort:"", title:entry.thirdPartySystem.p40Effort?'40% Effort':""}, {value:entry.thirdPartySystem.p20Effort?entry.thirdPartySystem.p20Effort:"", title:entry.thirdPartySystem.p20Effort?'20% Effort':""}, {value:entry.thirdPartySystem.p10Effort?entry.thirdPartySystem.p10Effort:"", title:entry.thirdPartySystem.p10Effort?'10% Effort':""}]}
                        />
                        <TopOverview 
                            title={"Vendor"} 
                            color="#58D7FF"
                            objects={[{value:entry.vendorResource, title:'Resources'}, {value:entry.vendorRateGBP, title:'Rate'}]}
                        />
                    </div>
                </div>
                <div className='rightPane'>
                    <div className='effort-breakdown-container'>
                        <h2 className='efforts-breakdown-title'>Efforts Breakdown</h2>
                        <div className='efforts-breakdown-list'>
                            {
                                entry.effortsArray.map(item => <EffortsArch key={JSON.stringify(item)} value={numberWithCommas(item.value)} title={item.title} />)
                            }
                        </div>
                    </div>

                    <div className='result-container'>
                        <h2 className='result-title'>Result</h2>
                        <div className='result-list'>
                            <ResultsArch color={'rgba(47, 168, 79, 0.12)'} value={numberWithCommas(entry.estimatedTime.hours)} title="Total hours estimated (MH)" />
                            <ResultsArch color={'rgba(66, 133, 244, 0.17)'} value={numberWithCommas(entry.estimatedTime.days)} title="Total days estimated (MD)" />
                            <ResultsArch color={'rgba(251, 188, 5, 0.24)'} value={`£ ${numberWithCommas(entry.estimatedTotalCost)}`} title="Total cost estimated (GBP)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className='estimation-details-container'>
            <Helmet>
                <title>Estimation Details - {entry.key}</title>
            </Helmet>
            <HomeNavigation hideSearchBar showBack />
            <div className='estimation-details-content'>
                <div className='edit-estimation-container'>
                    <h1 className='project-name'>{entry.projectName}</h1>
                    <BottomEntryDrawerComponent buttonText={"Edit Estimation"}  variant="Edit" entry={entry}/>
                </div>
                <p className='project-details'>{entry.projectDescription}</p>
                <div className='top-overview-area'>
                    <TopOverview 
                        title={"General"} 
                        color="#FF5858"
                        objects={[{value:entry.numOfRequirements, title:'Requirements'}, {value:entry.numOfSystems?entry.numOfSystems:"New", title:'Systems'}, {value:entry.complexity, title:'Complexity'}, {value: entry.tShirt, title:'T-Shirt'}]}
                    />
                    <TopOverview 
                        title={"Resources"} 
                        color="#FBBC05"
                        objects={[{value: entry.resources.l6?entry.resources.l6:"", title:entry.resources.l6?'L-6':""}, {value: entry.resources.l5?entry.resources.l5:"", title:entry.resources.l5?'L-5':""}, {value: entry.resources.l4?entry.resources.l4:"", title:entry.resources.l4?'L-4':""}]}
                    />
                    <TopOverview 
                        title={"Third Party Systems"} 
                        color="#58FF69"
                        objects={[{value:entry.thirdPartySystem.p40Effort?entry.thirdPartySystem.p40Effort:"", title:entry.thirdPartySystem.p40Effort?'40% Effort':""}, {value:entry.thirdPartySystem.p20Effort?entry.thirdPartySystem.p20Effort:"", title:entry.thirdPartySystem.p20Effort?'20% Effort':""}, {value:entry.thirdPartySystem.p10Effort?entry.thirdPartySystem.p10Effort:"", title:entry.thirdPartySystem.p10Effort?'10% Effort':""}]}
                    />
                    <TopOverview 
                        title={"Vendor"} 
                        color="#58D7FF"
                        objects={[{value:entry.vendorResource, title:'Resources'}, {value:entry.vendorRateGBP, title:'Rate'}]}
                    />
                </div>

                
            </div>
            <div className='effort-breakdown-container'>
                <h2 className='efforts-breakdown-title'>Efforts Breakdown</h2>
                <div className='efforts-breakdown-list'>
                    {
                        entry.effortsArray.map(item => <EffortsArch key={JSON.stringify(item)} value={numberWithCommas(item.value)} title={item.title} />)
                    }
                </div>
            </div>

            <div className='result-container'>
                <h2 className='result-title'>Result</h2>
                <div className='result-list'>
                <ResultsArch color={'rgba(47, 168, 79, 0.12)'} value={numberWithCommas(entry.estimatedTime.hours)} title="Total hours estimated (MH)" />
                <ResultsArch color={'rgba(66, 133, 244, 0.17)'} value={numberWithCommas(entry.estimatedTime.days)} title="Total days estimated (MD)" />
                <ResultsArch color={'rgba(251, 188, 5, 0.24)'} value={`£ ${numberWithCommas(entry.estimatedTotalCost)}`} title="Total cost estimated (GBP)" />
                </div>
            </div>
        </div>
    )
}

export default EstimationDetails


//req = number
//req -> complexity depending on range
//1-4=20
//5-10=50


//l1 - num
//l2 - 
//l3 - 
//vendor rate -

//time = (l1*req + l2*req + l3*req)*complexity
//cost = time * rate
