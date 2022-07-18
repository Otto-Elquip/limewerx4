import { useState, useEffect, React} from "react";
import { API } from 'aws-amplify';
import { listDevices, listCanData, listAccounts} from '../../graphql/queries'
import { withAuthenticator } from "@aws-amplify/ui-react";
import Navbar2 from "../components/Navbar";
import Alerts from "./components/Alerts";
import RegisterDevice from "./components/RegisterDevice";
import Cards from "./components/Cards";
import Charts from "./components/Charts";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactBootStrap from 'react-bootstrap';
import MyFiles from './components/MyFiles';
import { Row, Col, Container }from 'react-bootstrap';
import { CSVLink } from 'react-csv'
import { Auth } from 'aws-amplify';


const csvHeaders = [
    { label: 'Physical Value', key: 'PhysicalValue'},
    { label: 'Signal', key: 'Signal'},
    { label: 'Date Created', key: 'createdAt'},
    { label: 'Index', key: 'id'},
    { label: 'Date Updated', key: 'updatedAt'}
];

var initialCSVState = {
    filename: "NoVehicleSelected.csv",
    headers: csvHeaders,
    data: [{PhysicalValue: ' ', Signal: ' ', createdAt: ' ', deviceID: '', id: '', updatedAt: ''}]
};


function Home({deviceList}){

    const [tab, setTab] = useState(1);
    const [tabColours, setTabColours] = useState(['none', 'grey', 'grey', 'grey'])
    const [dList, setDList] = useState(deviceList);
    const [csvData, setCSVData] = useState(initialCSVState);
    const [deviceID, setDeviceID] = useState("");
    const [canData, setCanData] = useState([]);
    const [newDevice, setNewDevice] = useState(false);
    const [dispCard, setDispCard] = useState(false);
    const [dispChart, setDispChart] = useState(false);
    const [accountID, setAccountID] = useState();
    const [authenticated, setAuthenticated] = useState();

    useEffect(() => {
        
        setDeviceList(deviceList);
        checkAuth();
    }, [])

    const checkAuth = () =>
    {
      
      Promise.all([Auth.currentUserCredentials()])
      .then( result => {
        const [a] = result
        if(a.authenticated == true)
        {
          setAuthenticated(true);
        }
        if(a.authenticated == undefined)
        {
          setAuthenticated(false);
        }
      })
    }

    async function setDeviceList(dl){
        var user = await Auth.currentAuthenticatedUser();
        setAccountID(user);
        let filterStr = {CognitoUserName: {eq: user.username}}
        const accountList = await API.graphql({
            query: listAccounts, 
            variables: {filter: filterStr}
        })
        console.log(accountList)
        var userId = accountList.data.listAccounts.items[0].id
        setDList(dl.filter(x => x.accountID ==userId));
    }
    useEffect(() => {
        fetchCanData();
      }, [deviceID]);

    useEffect(() => {
        setTabLayout(tab);
    }, [tab])

    const setTabLayout = (t) => {
        switch(t) 
        {
            case 1:
                setTabColours(['white', 'grey', 'grey', 'grey'])
                break;
            case 2:
                setTabColours(['grey', 'white', 'grey', 'grey'])
                break;
            case 3:
                setTabColours(['grey', 'grey', 'white', 'grey'])
                break;
            case 4:
                setTabColours(['grey', 'grey', 'grey', 'white'])
                break;
        }
    }

    async function fetchCanData() {

        let filterStr = {deviceID: {eq: deviceID}};
        const data = await API.graphql({
            query: listCanData, variables: {filter: filterStr}});
            setCanData(data.data.listCanData.items);
        
        const todayDate = new Date();
        var csvReportContent = initialCSVState;
        if(data.data.listCanData.items.length != 0)
        {
            csvReportContent = {
                filename: `${deviceID}-${todayDate.toDateString()}.csv`,
                headers: csvHeaders,
                data: data.data.listCanData.items
            }
        }

        setCSVData(csvReportContent);
        
    }
    let handleDeviceChange = (e) => {
    setDeviceID(e.target.value)
    };

    const renderData = (data, index) => {
        return(
            <tr key={index}>
                <td>{data.deviceID}</td>
                <td>{data.Signal}</td>
                <td>{data.PhysicalValue}</td>
                <td>{data.createdAt}</td>
            </tr>
        )
    }

    const registerNewDevice = () =>
    {
        if(newDevice == false)
        {
            setNewDevice(true);
        }
        else
        {
            setNewDevice(false);
        }
    }

    function cardDisplay()
    {
        if(dispCard == false)
        {
            setDispCard(true);
        }
        else
        {
            setDispCard(false);
        }
    }

    function chartDisplay()
    {
        if(dispChart == false)
        {
            setDispChart(true);
        }
        else
        {
            setDispChart(false);
        }
    }

    function Cancel()
    {
        setNewDevice(false);
    }

  return (
    <div>
        <Navbar2 authenticated={authenticated} />
        <h1> {"\n"} </h1>
        <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
            <Col>
                <select style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}} onChange={handleDeviceChange}>
                    <option value="Select a vehicle" style={{justifyContent: 'center'}}>---Select a Vehicle---</option>
                    {dList.map((device) => <option key={device.id} value={device.CSSId}>{device.Vehicle}</option>)}
                    
                </select>
                <button style={{color: 'blue', paddingLeft: '10px'}} onClick={registerNewDevice}> Register New Device ↓ </button>
            </Col>
            {newDevice == true && (
                <>
                    <RegisterDevice AccountId={accountID} disp={newDevice}/>
                    <div style={{paddingLeft: '10px'}}>
                        <button
                            style={{color: 'blue'}}  
                            onClick={Cancel}> Cancel  
                        </button>
                    </div>
                </>
            )}
           <h1>
               {"\n"}
           </h1>
           <hr style={{color: 'black', height: 5}} />
           <h1>
               {"\n"}
           </h1>
            
            <button style={{ border: '1px solid black', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: `${tabColours[0]}`}}  onClick={() => setTab(1)}> Raw Data </button>
            <button style={{ border: '1px solid black', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: tabColours[1]}} onClick={() => setTab(2)}> Dashboard </button>
            <button style={{ border: '1px solid black', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: tabColours[2]}} onClick={() => setTab(3)}> Alerts </button>
            <button style={{ border: '1px solid black', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: tabColours[3]}} onClick={() => setTab(4)}> My Files </button>
            
            <hr style={{color: 'black', height: 5}} />

            {tab == 1 && (
                <div>
                    <CSVLink {...csvData}> Download Table Data to CSV</CSVLink>
                    <ReactBootStrap.Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Device ID</th>
                                <th>Signal</th>
                                <th>Physical Value</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {canData.map(renderData)}
                        </tbody>
                    </ReactBootStrap.Table>  
                </div>
            )}
            {tab== 2 && (

                <Container style={{justifyContent: 'left'}}>
                    <h3 className="text-1xl font-semibold tracking-wide mt-6 mb-2">
                        Cards
                    </h3>
                    <Row>
                        <Col>
                            <button 
                            style={{color: 'blue'}}
                            onClick={cardDisplay}
                            > Add Card ↓ </button>
                        </Col>
                    </Row>
                    <h1>
                        {"\n"}
                    </h1>

                    <Cards dId={deviceID} disp={dispCard} />

                    <h3 className="text-1xl font-semibold tracking-wide mt-6 mb-2">
                        Charts
                    </h3>
                    <button 
                            style={{color: 'blue'}}
                            onClick={chartDisplay}
                            > Add Chart ↓ </button>
                    <Charts dId={deviceID} disp={dispChart}/>

                </Container>
                    
            )}
            {tab == 3 && (
                <>
                    
                    <Alerts deviceID={deviceID}/>
                </>
            )}
            {tab == 4 && (
                <>
                    <MyFiles deviceID={deviceID} userID={accountID}/>
                </>

            )}
        </div>
    </div>  
  )
}

export const getStaticProps = async () => {

    const devices = await API.graphql({
        query: listDevices
    });
  
    const temp = devices.data.listDevices.items;
    var deviceList = temp    

    return {
        props: {
            deviceList
        }
    }
}

export default withAuthenticator(Home)