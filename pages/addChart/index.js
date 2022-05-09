
import Navbar from "../components/Navbar";
import { useRouter} from "next/router";
import { useEffect, useState } from "react";
import { API } from 'aws-amplify';
import { createChart } from "../../graphql/mutations";
import { listCanData } from "../../graphql/queries";

const initialState = { title: '', type: '', period: '', CSSId: '', isDisplayed: false, filter: ''}

function CreateChart() {
    const periodList = ['Last 24 Hours', 'Last Week', 'Last Month', 'Last Year'];
    const typeList = ['bar', 'line', 'scatter']
    const router = useRouter();
    const device = router.query.device;
    const [filterList, setFilterList] = useState([]);
    const [chart, setChart] = useState(initialState);
    const [signals, setSignals] = useState([]);
    useEffect(() => {
        getSignalList();
    },[])

    function onChange(e) {
        setChart(() => ({ ...chart, [e.target.name]: e.target.value}));
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
    }

    async function getSignalList() {
        let filterStr = {deviceID: {eq: device}};
        const signalList = await API.graphql({
            query: listCanData, variables: {filter: filterStr}});
        const signalSet = [...new Set(signalList.data.listCanData.items.map(item => item.Signal))];
        setSignals(signalSet);
        setChart(() => ({...chart, 'signal': signalSet[0], 'type': 'bar', 'period': 'Last 24 Hours', 'CSSId': device, 'isDisplayed': true, filter:'Hourly Average'}));
    }
    return (
    <>
      <Navbar />
        <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
            <h1 className="text-3xl font-semibold tracking-wide mt-6"> Add Chart</h1>
            <hr style={{color: 'black', height: 5}} />
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
            <button style={{ border: '1px solid black', borderRadius: '7px', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: '#483D8B', color: 'white'}}
            onClick={createNewChart}> Add Chart </button>
            <h1>
               {"\n"}
            </h1>

        </div>

    </>
  );
}

export default CreateChart
