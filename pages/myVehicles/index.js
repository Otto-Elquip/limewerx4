import { useState, useEffect } from "react";
import { API } from 'aws-amplify'
import { listDevices, listCanData } from '../../graphql/queries'
import { ButtonGroup } from "@aws-amplify/ui-react";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactBootStrap from 'react-bootstrap';
import BarChart from './components/BarChart';
import { Card, Row, Col, Container }from 'react-bootstrap';

export default function Home({deviceList, Data}){
    const [tab, setTab] = useState(1);
    const [dList, setDList] = useState(deviceList);
    const [deviceID, setDeviceID] = useState("");
    const [canData, setCanData] = useState([]);
    const [cardData, setCardData] = useState([]);

    useEffect(() => {
        fetchCanData()
      }, [deviceID]);
    
      async function fetchCanData() {
        let filterStr = {deviceID: {eq: deviceID}};
        const data = await API.graphql({
            query: listCanData, variables: {filter: filterStr}});
            setCanData(data.data.listCanData.items);
            console.log(canData)
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


      const cData = 
          [{Signal: 'Daily Average Engine Hours (last week)', Value: 14, Units: 'hours'},
          {Signal: 'Daily Average Engine Hours (last week)', Value: 14, Units: 'hours'},
          {Signal: 'Daily Average Engine Hours (last week)', Value: 14, Units: 'hours'},
          {Signal: 'Daily Average Engine Hours (last week)', Value: 14, Units: 'hours'},
          {Signal: 'Daily Average Engine Hours (last week)', Value: 14, Units: 'hours'},
          {Signal: 'Daily Average Engine Hours (last week)', Value: 14, Units: 'hours'},
          {Signal: 'Daily Average Engine Hours (last week)', Value: 14, Units: 'hours'}];
      useEffect(() => {
          setCardData(cData)
      },[])
      
  return (
    <>
    <Navbar/>
    <h5 className="text-1xl font-semibold tracking-wide mt-6 mb-2" style={{paddingTop: '10px', paddingLeft: '15px'}} >Vehicle Data</h5>
    <select style={{paddingTop: '10px', paddingLeft: '15px'}} onChange={handleDeviceChange}>
        <option value="Select a vehicle">---Select a Vehicle---</option>
        {dList.map((device) => <option key={device.id} value={device.CSSId}>{device.Vehicle}</option>)}
    </select>
    
    <ButtonGroup>
        <button style={{paddingTop: '10px', paddingLeft: '15px', paddingBottom: '15px'}} onClick={() => setTab(1)}> Raw Data </button>
        <button style={{paddingLeft: '15px'}} onClick={() => setTab(2)}> Dashboard </button>
        <button style={{paddingLeft: '15px'}} onClick={() => setTab(3)}> Alerts </button>
        <button style={{paddingLeft: '15px'}} onClick={() => setTab(4)}> My Files </button>
    </ButtonGroup>
    

    

    {tab == 1 && (
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
    )}
    {tab == 2 && (
        <Container>
            <Row style={{paddingBottom: '15px'}}>
                {cardData.map((cardData, k) => (
                    <Col key={k} xs={12} md={4} lg={3}>
                        <Card>
                        <Card.Header>{cardData.Signal}</Card.Header>
                        <Card.Body>
                            <Card.Title style={{textAlign: "center"}}>{cardData.Value}</Card.Title>
                            <Card.Text style={{textAlign: "center"}}>
                                {cardData.Units}
                            </Card.Text>
                        </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <BarChart />
        </Container>
            
    )}
    {tab == 3 && (
        <h3 className="text-1xl font-semibold tracking-wide mt-6 mb-2" style={{paddingTop: '10px', paddingLeft: '15px'}} >You currently do not have any alerts</h3>
    )}
    {tab == 4 && (
        <h3 className="text-1xl font-semibold tracking-wide mt-6 mb-2" style={{paddingTop: '10px', paddingLeft: '15px'}} >You currently do not have any files uploaded</h3>
    )}
    </>  
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