
import Navbar from "../components/Navbar";
import { useRouter} from "next/router";
import { useEffect, useState } from "react";
import { API } from 'aws-amplify';
import { createCard } from "../../graphql/mutations";
import { listCanData } from "../../graphql/queries";

const initialState = { title: '', type: '', period: '', CSSId: '', isDisplayed: false}

function CreateCard() {
    const typeList = ['Max', 'Min', 'Average'];
    const periodList = ['Last 24 Hours', 'Last Week', 'Last Month', 'Last Year'];
    const router = useRouter();
    const device = router.query.device;
    const [card, setCard] = useState(initialState);
    const [signals, setSignals] = useState([]);
    useEffect(() => {
        getSignalList();
    },[]);

    function onChange(e) {
        setCard(() => ({ ...card, [e.target.name]: e.target.value}));
    }

    async function createNewCard() {
        if(!card.title || !card.type || !card.period) return
        await API.graphql({
            query: createCard,
            variables: { input: card}
        });
    }

    async function getSignalList() {
        let filterStr = {deviceID: {eq: device}};
        console.log(filterStr)
        const signalList = await API.graphql({
            query: listCanData, variables: {filter: filterStr}});
        const signalSet = [...new Set(signalList.data.listCanData.items.map(item => item.Signal))];
        setSignals(signalSet);
        setCard(() => ({...card, 'signal': signalSet[0], 'type': 'Max', 'period': 'Last 24 Hours', 'CSSId': device, 'isDisplayed': true}));
    }
    return (
    <>
      <Navbar />
        <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
            <h1 className="text-3xl font-semibold tracking-wide mt-6"> Add Card</h1>
            <hr style={{color: 'black', height: 5}} />
            <h3 className="text-1xl font=semibold tracking-wide mt-6"> Card Title</h3>
            <input
                onChange={onChange}
                name="title"
                placeholder="Title"
                value={card.title}
                className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light
                text-gray-500 placeholder-gray-500 y-z">
            </input>
            <div className="text-1xl font=semibold tracking-wide mt-6"> Choose a Signal to Monitor</div>
            <select name='signal' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
            onChange={onChange}>{
                signals.map( (x,y) => 
                <option key={y}>{x}</option> )
            }</select>
            <div className="text-1xl font=semibold tracking-wide mt-6"> Choose the Filter Type</div>
            <select name='type' style={{border: '1px solid black', borderRadius: '7px', width: '350px', height: '40px', justifyContent: 'center'}}
            onChange={onChange}>{
                typeList.map( (x,y) => 
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
            <button style={{ border: '1px solid black', borderRadius: '7px', width: '100px', height: '40px', justifyContent: 'center', backgroundColor: '#483D8B', color: 'white'}}
            onClick={createNewCard}> Add Card </button>
            <h1>
               {"\n"}
            </h1>

        </div>

    </>
  );
}

export default CreateCard
