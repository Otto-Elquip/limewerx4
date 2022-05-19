
import { useEffect, useState } from "react";
import { API } from 'aws-amplify';
import { listCanData, listDevices, listAlerts } from "../../../graphql/queries";
import { createAlert } from "../../../graphql/mutations";
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ReactBootStrap from 'react-bootstrap';




const initialState = { title: '', type: '', period: '', isDisplayed: false, condition: '', threshold: '', deviceID: ''}

const Alerts = (deviceID) => {

    const typeList = ['Max', 'Min', 'Average', 'Total'];
    const periodList =['Last 24 Hours', 'Last Week', 'Last Month', 'Last Year'];
    const conditionList = ['is equal to', 'is less than', 'is greater than'];
    const [alert, setAlert] = useState(initialState);
    const [device, setDevice] = useState();
    const [signals, setSignals] = useState([]);
    const [addAlert, setAddAlert] = useState(0);
    const [alertData, setAlertData] = useState([]);
    const [alertList, setAlertList] = useState([]);

    function onChange(e){
        setAlert(() => ({...alert, [e.target.name]: e.target.value}));
    }

    useEffect(() => {
        getData(deviceID);
    },[deviceID]);

    async function getData(deviceID) {
        let filterStr = {deviceID: {eq: deviceID.deviceID}};
        const signalList = await API.graphql({
            query: listCanData, variables: {filter: filterStr}});
        const signalSet = [...new Set(signalList.data.listCanData.items.map(item => item.Signal))];
        setSignals(signalSet);

        let filterStr2 = {CSSId: {eq: deviceID.deviceID}};
        const deviceId = await API.graphql({
            query: listDevices , variables: {filter: filterStr2}});
        var dID = deviceId.data.listDevices.items[0].id;
        setDevice(dID);

        let filterStr3 = {deviceID: {eq: dID}};
        const deviceAlerts = await API.graphql({
            query: listAlerts, variables: {filter: filterStr3}});
        
        setAlertList(deviceAlerts.data.listAlerts.items)
        setAlert(() => ({...alert, 'signal': '---Select a Signal---', 'type': '---Select a Filter---', 'period': '---Select a Period---', 'deviceID': dID, 'isDisplayed': true, 'condition': '---Select a Condition---', threshold: ''}));
        
        var alertList = [];
        deviceAlerts.data.listAlerts.items.forEach(function(al){
            var relevantSignals = signalList.data.listCanData.items.filter( x => x.Signal == al.signal)
            var values = {value: [], date: []};
            var allowableCardDiff = 0;
            switch(al.period)
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
            relevantSignals.forEach(function(e){
                var canDate = e.createdAt.split("-");
                var dateString = `${canDate[0]}/${canDate[2].split("T")[0]}/${canDate[1]}`;
                var date1 = new Date();
                var date2 = new Date(dateString);
                var timeDiff = date1.getTime() - date2.getTime();
                var dayDiff = timeDiff/(1000*3600*24);
                if(dayDiff < allowableCardDiff)
                {
                    values.value.push(parseInt(e.PhysicalValue));
                    values.date.push(date2);
                }
                
            })
            var singleVal;
            var dateVal;
            var dateNow = new Date();
            switch(al.type)
            {
                case 'Total':
                    if(values.value.length>0)
                    {
                        singleVal = values.value.reduce((partialSum), a => partialSum + a, 0);
                        dateVal = `${dateNow.toString()} - ${dateNow.setDate(dateNow.getDate() - allowableCardDiff)}`;
                    }
                    else
                    {
                        singleVal = 'No data available for this time period';
                        dateVal = "";
                    }
                    break
                case 'Max':
                    if(values.value.length>0)
                    {
                        singleVal = Math.max.apply(Math, values.value);
                        dateVal = values.date[values.value.indexOf(singleVal)];
                    }
                    else
                    {
                        singleVal= 'No data available for this time period';
                        dateVal = "";
                    }
                    break;
                case 'Min':
                    if(values.value.length>0)
                    {
                        singleVal = Math.min.apply(Math, values.value);
                        dateVal = values.date[values.value.indexOf(singleVal)];
                    }
                    else
                    {
                        singleVal = 'No data available for this time period';
                        dateVal = "";
                    }
                    break;
                case 'Average':
                    if(values.value.length>0)
                    {
                        var sum = values.value.reduce((a, b) => a + b, 0);
                        singleVal = (sum/values.length) || 0;
                        dateVal = `${dateNow.toString()} - ${dateNow.setDate(dateNow.getDate() - allowableCardDiff)}`;
                    }
                    else
                    {
                        singleVal = 'No data available for this time period';
                        dateVal = "";
                    }
                    break;
            }          
            var isAlert = checkAlert(al.threshold, singleVal, al.condition)
            if(isAlert)
            {
                var date1 = new Date();
                var data = {deviceID: deviceID,  Alert: al.title, Signal: al.signal, PhysicalValue: singleVal, SetThreshold: al.threshold, alertCreatedAt: dateVal};
                alertList.push(data)
            }
        })
        setAlertData(alertList);
    }

    function checkAlert(threshold, data, condition)
    {
     
        if(data == 'No data available for this time period')
        {
            return false
        }
        else
        {
            switch(condition)
            {
                case 'is equal to':
                    if(threshold == data)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }

                case 'is less than':
                    if(data < threshold)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                case 'is greater than':
                    if(data > threshold)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                default:
                    return false;
            }
        }

    }

    async function createNewAlert() {
        if(!alert.title || !alert.type || !alert.period || !alert.condition || !alert.threshold) 
        {
            notify('Error Adding Alert, Please Try Again');
            return;
        }
        var PostResult = await API.graphql({
            query: createAlert,
            variables: { input: alert}
        });
        if(PostResult.data != undefined)
        {
            notify('Alert Successfully Added');
            var alertReset = {signal: '---Select a Signal---', type: '---Select a Filter---', period: '---Select a Period---', deviceID: device, isDisplayed: true, condition: '---Select a Condition---', threshold: '', title: ""};
            setAlert(alertReset);
        }
        else
        {
            notify('Error Adding Alert, Please Try Again');
        }

    }

    const notify = (message) => {
        toast(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            });
    }

    const setLayout = () => {
        if(addAlert == 0)
        {
            setAddAlert(1);
        }
        else if(addAlert == 1)
        {
            setAddAlert(0);
        }
        return;
    }

    const renderData = (data, index) => {
        return(
            <tr key={index}>
                <td>{data.deviceID.deviceID}</td>
                <td>{data.Signal}</td>
                <td>{data.PhysicalValue}</td>
                <td>{data.SetThreshold}</td>
                <td>{data.alertCreatedAt.toString().split(" ").slice(0, 4)}</td>
            </tr>
        )
    }
    const renderData2 = (data, index) => {
        return(
            <tr key={index}>
                <td>{data.title}</td>
                <td>{data.type}</td>
                <td>{data.signal}</td>
                <td>{data.condition}</td>
                <td>{data.threshold}</td>
            </tr>
        )
    }
    console.log(alertList)
    return (
        <>
            <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
            <button style={{color: "blue"}} onClick={() => setLayout()}> Add Alert ↓</button>
            {addAlert == 1 && (
                <>
                    <h3 className="text-1xl font=semibold tracking-wide mt-6"> Alert Title</h3>
                    <input
                        onChange={onChange}
                        name="title"
                        placeholder="Title"
                        value={alert.title}
                        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light
                        text-gray-500 placeholder-gray-500 y-z">
                    </input>
                    <div className="text-1xl font=semibold tracking-wide mt-6"> Alert me when the: </div>
                    <select name='type' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
                    onChange={onChange}>
                        <option>{alert.type}</option>{
                        typeList.map( (x,y) => 
                        <option key={y}>{x}</option> )
                    }</select>
                    <div className="text-1xl font=semibold tracking-wide mt-6"></div>
                    <select name='signal' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
                    onChange={onChange}>
                        <option>{alert.signal}</option>{
                        signals.map( (x,y) => 
                        <option key={y}>{x}</option> )
                    }</select>
                    <div className="text-1xl font=semibold tracking-wide mt-6"> </div>
                        <select name='condition' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
                        onChange={onChange}>
                            <option>{alert.condition}</option>{
                            conditionList.map( (x,y) => 
                            <option key={y}>{x}</option> )
                        }</select>
                    <div className="text-1xl font=semibold tracking-wide mt-6">
                        <input
                            onChange={onChange}
                            name="threshold"
                            placeholder="Threshold"
                            value={alert.threshold}
                            style={{border: '1px solid black', borderRadius: '7px', width: '100px', height: '40px', justifyContent: 'center'}}>
                        </input>
                    </div>
                    <div className="text-1xl font=semibold tracking-wide mt-6"> Over the</div>
                    <select name='period' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
                    onChange={onChange}>
                        <option>{alert.period}</option>{
                        periodList.map( (x,y) => 
                        <option key={y}>{x}</option> )
                    }</select>
                    <h1>
                    {"\n"}
                    </h1>
                    <button style={{color: 'blue' }}
                    onClick={createNewAlert}> Create Alert │ </button>

                    <button style={{ color: 'blue', paddingLeft: '7px'}}
                    onClick={() => setAddAlert(0)}> Cancel </button>
                    <h1>
                    {"\n"}
                    </h1>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        />
                        {/* Same as */}
                    <ToastContainer />
                </>

            )}
            <h4>Configured Alerts</h4>
            <ReactBootStrap.Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Signal Type</th>
                        <th>Signal</th>
                        <th>Condition</th>
                        <th>Threshold</th>
                    </tr>
                </thead>
                <tbody>
                    {alertList.map(renderData2)}
                </tbody>
            </ReactBootStrap.Table> 

            <hr style={{color: 'black', height: 2}} />
            <h4>My Alerts</h4>
            <ReactBootStrap.Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Device ID</th>
                        <th>Signal</th>
                        <th>Physical Value</th>
                        <th>Set Threshold</th>
                        <th>Alert Triggered At</th>
                    </tr>
                </thead>
                <tbody>
                    {alertData.map(renderData)}
                </tbody>
            </ReactBootStrap.Table> 

               
    
            </div>
    
        </>
      );
}

export default Alerts