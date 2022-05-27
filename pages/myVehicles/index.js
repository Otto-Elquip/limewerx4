import { useState, useEffect, React} from "react";
import { API } from 'aws-amplify';
import { listDevices, listCanData, listAccounts, listCards, listCharts} from '../../graphql/queries'
import { updateCard, updateChart } from '../../graphql/mutations'
import { ButtonGroup, withAuthenticator } from "@aws-amplify/ui-react";
import Navbar2 from "../components/Navbar";
import Alerts from "./components/Alerts";
import RegisterDevice from "./components/RegisterDevice";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactBootStrap from 'react-bootstrap';
import BarChart from './components/BarChart';
import { Card, Row, Col, Container }from 'react-bootstrap';
import Link from 'next/link';
import { CSVLink } from 'react-csv'
import ReactTooltip from "react-tooltip";
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


function Home({deviceList, deviceIDs, user}){

    const [tab, setTab] = useState(1);
    const [chartData, setChartData] = useState([]);
    const [tabColours, setTabColours] = useState(['none', 'grey', 'grey', 'grey'])
    const [dList, setDList] = useState([]);
    const [csvData, setCSVData] = useState(initialCSVState);
    const [deviceID, setDeviceID] = useState("");
    const [canData, setCanData] = useState([]);
    const [cardData, setCardData] = useState([]);
    const [showDelete, setShowDelete] = useState(true);
    const [newDevice, setNewDevice] = useState(false);
    const [accountID, setAccountID] = useState();
    const [authenticated, setAuthenticated] = useState();

    useEffect(() => {
        setAccountID(user.username);
        setDeviceList(deviceList);
        checkAuth();
    }, [])

    const checkAuth = () =>
    {
      
      Promise.all([Auth.currentUserCredentials()])
      .then( result => {
        const [a] = result;
        console.log(a.authenticated)
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
        let filterStr = {CognitoUserName: {eq: user.username}}
        const accountList = await API.graphql({
            query: listAccounts, 
            variables: {filter: filterStr}
        })
        var userId = accountList.data.listAccounts.items[0].id
        console.log('setting device list')
        console.log(dl.filter(x => x.accountID ==userId))
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
        let filterStr2 = {CSSId: {eq: deviceID}};
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
        const cards = await API.graphql({
            query: listCards,
            variables: {filter: filterStr2}
        });
        let filterStr3 = {filter: {CSSId: {eq: deviceID}}};
        const chartList = await API.graphql({
        query: listCharts,
        variables: filterStr3
        });
        var gData = [];
        var displayedCharts = chartList.data.listCharts.items.filter(x => x.isDisplayed == true);
        displayedCharts.forEach(function(chart){
            const rn = new Date();
            var labels = [];
            var graphData = [];
            var chartTimeData = data.data.listCanData.items.filter(x => x.Signal == chart.signal)
            switch(chart.period)
            {
                case 'Last 24 Hours':
                    for (let i =0; i<24; i++){
                        var labelDate = new Date((rn.setHours(rn.getHours() - 1)))
                        labels.push(labelDate.toString().split(" ").slice(4, 5).join(","))
                        var dataInstance = [];
                        chartTimeData.forEach(function(canEntry){
                            var cd = canEntry.createdAt.split("-");
                            var dateString = `${cd[0]}/${cd[2].split("T")[0]}/${cd[1]} ${cd[2].split("T")[1].split(".")[0]}`;
                            var dateComp = new Date(dateString);
                            if((dateComp.getTime() - rn.getTime())/(1000*60*60) < 1 && (dateComp.getTime() - rn.getTime())/(1000*60*60) > 0)
                            {
                                dataInstance.push(parseInt(canEntry.PhysicalValue));
                            }
                            
                        })
                        graphData.push(dataInstance)
                    }

                    break;
                case 'Last Week':
                    for (let i =0; i<7; i++){
                        var labelDate = new Date(rn.setDate(rn.getDate() - 1));
                        labels.push(labelDate.toString().split(" ").slice(0, 3).join(","))
                        var dataInstance = [];
                        chartTimeData.forEach(function(canEntry){
                            var cd = canEntry.createdAt.split("-");
                            var dateString = `${cd[0]}/${cd[2].split("T")[0]}/${cd[1]} ${cd[2].split("T")[1].split(".")[0]}`;
                            var dateComp = new Date(dateString);
                            if((dateComp.getTime() - rn.getTime())/(1000*60*60*24) < 1 && (dateComp.getTime() - rn.getTime())/(1000*60*60*24) > 0)
                            {
                                dataInstance.push(parseInt(canEntry.PhysicalValue));
                            }
                        })
                        graphData.push(dataInstance);
                    }
                    break;
                case 'Last Month':
                    for (let i =0; i<4; i++){
                        var weekSpace = new Date(rn);
                        var labelDate = new Date(rn.setDate(rn.getDate() - 7));
                        labels.push(`${weekSpace.toString().split(" ").slice(1, 3)} - ${labelDate.toString().split(" ").slice(1, 3)}`)
                        var dataInstance = [];
                        chartTimeData.forEach(function(canEntry){
                            var cd = canEntry.createdAt.split("-");
                            var dateString = `${cd[0]}/${cd[2].split("T")[0]}/${cd[1]} ${cd[2].split("T")[1].split(".")[0]}`;
                            var dateComp = new Date(dateString);
                            if((dateComp.getTime() - rn.getTime())/(1000*60*60*24*7) < 1 && (dateComp.getTime() - rn.getTime())/(1000*60*60*24) > 0)
                            {
                                dataInstance.push(parseInt(canEntry.PhysicalValue));
                            }
                        })
                        graphData.push(dataInstance);
                    }
                    break;
                case 'Last Year':
                    for (let i =0; i<12; i++){
                        var monthSpace = new Date(rn);
                        var labelDate = new Date(rn.setMonth(rn.getMonth() - 1));
                        labels.push(`${monthSpace.toString().split(" ").slice(1, 3)} - ${labelDate.toString().split(" ").slice(1, 3)}`)                
                        var dataInstance = [];
                        chartTimeData.forEach(function(canEntry){
                            var cd = canEntry.createdAt.split("-");
                            var dateString = `${cd[0]}/${cd[2].split("T")[0]}/${cd[1]} ${cd[2].split("T")[1].split(".")[0]}`;
                            var dateComp = new Date(dateString);
                            if((dateComp.getTime() - rn.getTime())/(1000*60*60*24*30.5) < 1 && (dateComp.getTime() - rn.getTime())/(1000*60*60*24*30.5) > 0)
                            {
                                dataInstance.push(parseInt(canEntry.PhysicalValue));
                            }
                        })
                        graphData.push(dataInstance);
                    }
                    break;
            }       
            var sortedData = [];
            var temp = 0;
            graphData.forEach(function(i){
                if(chart.filter.includes('Max'))
                {
                    temp = Math.max.apply(Math, i)
                }
                else if(chart.filter.includes('Min'))
                {
                    temp = Math.max.apply(Math, i)
                }
                else if(chart.filter.includes('Average'))
                {
                    var sum = i.reduce((a, b) => a + b, 0);
                    temp = (sum/i.length) || 0;
                }
                sortedData.push(temp);
            })
            var graphDataInstance = {label: labels, data: sortedData, title: chart.title, type: chart.type, period: chart.period, id: chart.id, version: chart._version};
            gData.push(graphDataInstance);
        })
        setChartData(gData);
        var allowableCardDiff = 0;
        var cData = [];
        var displayedCards = cards.data.listCards.items.filter(x => x.isDisplayed == true)
        displayedCards.forEach(function(card){
            switch(card.period)
            {
                case 'Last 24 Hours':
                    allowableCardDiff = 1;
                    break;
                case 'Last Week':
                    allowableCardDiff = 8;
                    break;
                case 'Last Month':
                    allowableCardDiff = 31;
                    break;
                case 'Last Year':
                    allowableCardDiff = 365;
                    break;
            }

            var filteredData = data.data.listCanData.items.filter( x => x.Signal == card.signal)
            var values = [];
            filteredData.forEach(function(e){
                var canDate = e.createdAt.split("-");
                var dateString = `${canDate[0]}/${canDate[2].split("T")[0]}/${canDate[1]}`;
                var date1 = new Date();
                var date2 = new Date(dateString);
                var timeDiff = date1.getTime() - date2.getTime();
                var dayDiff = timeDiff/(1000*3600*24);
                if(dayDiff < allowableCardDiff)
                {
                    values.push(parseInt(e.PhysicalValue))
                }
                
            })
            switch(card.type)
            {
                case 'Max':
                    if(values.length>0)
                    {
                    var cardVal = Math.max.apply(Math, values);
                    }
                    else
                    {
                        var cardVal = 'No data available for this time period';
                    }
                    cData.push({Signal: card.title, Value: cardVal, Units: '', id: card.id, version: card._version});
                    break;
                case 'Min':
                    if(values.length>0)
                    {
                        var cardVal = Math.min.apply(Math, values);
                    }
                    else
                    {
                        var cardVal = 'No data available for this time period';
                    }
                    cData.push({Signal: card.title, Value: cardVal, Units: '', id: card.id, version: card._version});
                    break;
                case 'Average':
                    if(values.length>0)
                    {
                        var sum = values.reduce((a, b) => a + b, 0);
                        var avg = (sum/values.length) || 0;
                    }
                    else
                    {
                        var avg = 'No data available for this time period';
                    }
                    cData.push({Signal: card.title, Value: avg, Units: '', id: card.id, version: card._version});
                    break;
            }          
        })
        setCardData(cData);
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

    async function deleteCardByID(cardEl)
    {
        var cardId = cardEl.target.name.split("!")[0].toString();
        var versionNum = cardEl.target.name.split("!")[1].toString();
        const cardDetails = {id: cardId, isDisplayed: false, _version: versionNum};
        await API.graphql({
            query: updateCard, 
            variables: {input: cardDetails}});
        await fetchCanData();
    }
    async function deleteChartByID(chartEl)
    {
        var chartId = chartEl.target.name.split("!")[0].toString();
        var versionNum = chartEl.target.name.split("!")[1].toString();
        const chartDetails = {id: chartId, isDisplayed: false, _version: versionNum};
        await API.graphql({
            query: updateChart, 
            variables: {input: chartDetails}});
        await fetchCanData();
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
    console.log(authenticated)
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
                
                </>
            )}
           <h1>
               {"\n"}
           </h1>
           <hr style={{color: 'black', height: 5}} />
           <h1>
               {"\n"}
           </h1>
            
            <ButtonGroup>
                <button style={{ border: '1px solid black', borderRadius: '7px', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: `${tabColours[0]}`}}  onClick={() => setTab(1)}> Raw Data </button>
                <button style={{ border: '1px solid black', borderRadius: '7px', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: tabColours[1]}} onClick={() => setTab(2)}> Dashboard </button>
                <button style={{ border: '1px solid black', borderRadius: '7px', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: tabColours[2]}} onClick={() => setTab(3)}> Alerts </button>
                <button style={{ border: '1px solid black', borderRadius: '7px', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: tabColours[3]}} onClick={() => setTab(4)}> My Files </button>
            </ButtonGroup>
            
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
                        <Link
                        href={{
                            pathname: '/addCard',
                            query: { device: deviceID },
                        }}
                        >
                        <button 
                        style={{color: 'blue'}}  
                        > Add Card ↓ </button>
                        </Link>
                    <h1>
                        {"\n"}
                    </h1>
                    <Row style={{paddingBottom: '15px'}}>
                        {cardData.map((cardData, k) => (
                            <Col key={k} xs={12} md={3} lg={4}>
                                <Card>
                                <Card.Header>{cardData.Signal} 
                                <button name={`${cardData.id}!${cardData.version}`} 
                                onClick={deleteCardByID}>🗑️</button></Card.Header>
                                <Card.Body>
                                    <Card.Title style={{textAlign: "center"}}>{cardData.Value}</Card.Title>
                                    <Card.Text style={{textAlign: "center"}}>
                                        {cardData.Units}
                                    </Card.Text>
                                </Card.Body>
                                </Card>
                                <h1>{"\n"}</h1>
                            </Col>
                        ))}             
                        
                    </Row>
                    <h3 className="text-1xl font-semibold tracking-wide mt-6 mb-2">
                        Charts
                    </h3>
                    <Link
                        href={{
                            pathname: '/addChart',
                            query: { device: deviceID },
                        }}
                        >
                        <button 
                        style={{color: 'blue'}}  
                        > Add Chart ↓ </button>
                        </Link>
                    <Row>
                            {chartData.map((c, k) => (
                                <Col key={k} xs={100} md={100} lg={100}>
                                    <Card style={{height: "32vw"}}>
                                    <Card.Header> <button name={`${c.id}!${c.version}`} 
                                onClick={deleteChartByID}>🗑️</button></Card.Header>
                                    <Card.Body>
                                         <BarChart chartData={c} />
                                    </Card.Body>
                                    </Card>
                                </Col>
                                
                            ))}
                            
                    </Row>

                </Container>
                    
            )}
            {tab == 3 && (
                <>
                    
                    <Alerts deviceID={deviceID}/>
                </>
            )}
            {tab == 4 && (
                <h3 className="text-1xl font-semibold tracking-wide mt-6 mb-2" style={{paddingTop: '10px', paddingLeft: '15px'}} >You currently do not have any files uploaded</h3>
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