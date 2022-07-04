import { useState, useEffect, React} from "react";
import { Card, Row, Col, Container }from 'react-bootstrap';
import { API } from 'aws-amplify';
import { listCharts, listCanData } from '../../../graphql/queries'
import { updateChart, createChart } from '../../../graphql/mutations'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BarChart from './BarChart';

const initialState = { title: '', type: '', period: '', CSSId: '', isDisplayed: false, filter: ''}
const exampleState = {data: [24, 62, 55, 17, 30, 41, 59], label: ['Jun 10', 'Jun 11', 'Jun 12', 'Jun 13', 'Jun 14', 'Jun 15', 'Jun 16'], title: 'Chart Title', period: 'Chart Period', type: 'bar'};
const SIGNAL_LIMIT = 5000;
const Charts = (dID) => {
    const periodList = ['Last 24 Hours', 'Last Week', 'Last Month', 'Last Year'];
    const typeList = ['bar', 'line'];
    const [deviceID, setDeviceID] = useState(dID.dId);
    const [displayChart, setDisplayChart] = useState(dID.disp);
    const [filterList, setFilterList] = useState([]);
    const [chart, setChart] = useState(initialState);
    const [signals, setSignals] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [exampleChart, setExampleChart] = useState(exampleState);


    useEffect(() => {
        generateCharts();
        setDisplayChart(dID.disp);
    }, [dID])

    useEffect(() => {
        getSignalList();
    },[]);

    const cancelChart = (e) =>
    {
        setDisplayChart(false);
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
    })};



    async function getSignalList() {
        let filterStr = {deviceID: {eq: deviceID}};
        const signalList = await API.graphql({
            query: listCanData, variables: {filter: filterStr, limit: SIGNAL_LIMIT}});
        const signalSet = [...new Set(signalList.data.listCanData.items.map(item => item.Signal))];
        setSignals(signalSet);
        setChart(() => ({...chart, 'signal': signalSet[0], 'type': 'bar', 'period': 'Last 24 Hours', 'CSSId': deviceID, 'isDisplayed': true, filter:'Hourly Average'}));
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

    function onChange(e) {
        setChart(() => ({ ...chart, [e.target.name]: e.target.value}));
        setExampleChart(() => ({ ...exampleChart, [e.target.name]: e.target.value}));

        if(e.target.name == 'period')
        {
            var filters = [];
            switch(e.target.value)
            {
                case 'Last 24 Hours':
                    filters = ['Hourly Max', 'Hourly Min', 'Hourly Average', 'All Data Points'];
                    break;
                case 'Last Week': 
                    filters = ['Daily Max', 'Daily Min', 'Daily Average', 'All Data Points'];
                    break;
                case 'Last Month':
                    filters = ['Weekly Max', 'Weekly Min', 'Weekly Average', 'All Data Points'];
                    break;
                case 'Last Year':
                    filters = ['Monthly Max', 'Monthly Min', 'Monthly Average', 'All Data Points'];
                    break;
            }
            setFilterList(filters);
        }
    }

    async function createNewChart() {
        if(!chart.title || !chart.type || !chart.period || !chart.CSSId || !chart.filter) return
        await API.graphql({
            query: createChart,
            variables: { input: chart}
        });
        notify("Chart Added");
        setDisplayChart(false);
        setChart(initialState);
        setExampleChart(exampleState);
        await generateCharts();
    }

    async function generateCharts() {

        let filterStr = {deviceID: {eq: deviceID}};
        const data = await API.graphql({
            query: listCanData, variables: {filter: filterStr}});

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
        console.log(gData)
      }

    return (
        <div>
            {displayChart == true && (
            <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
                <Row>
                    <Col xs={12} md={4}>
                        <h3 className="text-1xl font=semibold tracking-wide mt-6"> Chart Title</h3>
                        <input
                            onChange={onChange}
                            name="title"
                            placeholder="Title"
                            value={chart.title}
                            className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light
                            text-gray-500 placeholder-gray-500 y-z">
                        </input>
                        <div className="text-1xl font=semibold tracking-wide mt-6"> Choose a Signal to Monitor</div>
                        <select name='signal' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
                        onChange={onChange}>{
                            signals.map( (x,y) => 
                            <option key={y}>{x}</option> )
                        }</select>
                                    <div className="text-1xl font=semibold tracking-wide mt-6"> Choose the time period (from today)</div>
                        <select name='period' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
                        onChange={onChange}>{
                            periodList.map( (x,y) => 
                            <option key={y}>{x}</option> )
                        }</select>
                        <h1>
                        {"\n"}
                        </h1>
                        <div className="text-1xl font=semibold tracking-wide mt-6"> Choose a Graph Type</div>
                        <select name='type' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
                        onChange={onChange}>{
                            typeList.map( (x,y) => 
                            <option key={y}>{x}</option> )
                        }</select>
                        <h1>
                        {"\n"}
                        </h1>
                        <div className="text-1xl font=semibold tracking-wide mt-6"> Sort Data by: </div>
                        <select name='filter' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
                        onChange={onChange}>{
                            filterList.map( (x,y) => 
                            <option key={y}>{x}</option> )
                        }</select>
                        <h1>
                        {"\n"}
                        </h1>
                    </Col>
                    <Col xs={12} md={1}></Col>
                    <Col xs={12} md={7} lg={7}>
                        <Card style={{height: "18vw"}}>
                            <Card.Body>
                                    <BarChart chartData={exampleChart} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2}>
                        <button style={{ color: 'blue'}}
                        onClick={createNewChart}> Add Chart </button>
                    </Col>
                    <Col>
                    <button style={{ color: 'blue'}}
                        onClick={cancelChart}> Cancel </button>
                    </Col>
                </Row>

                <h1>
                    {"\n"}
                </h1>

            </div>
            )}
            <Container>
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
        </div>
    )

}

export default Charts