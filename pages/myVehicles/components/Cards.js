import { useState, useEffect, React} from "react";
import { Card, Row, Col, Container }from 'react-bootstrap';
import { API } from 'aws-amplify';
import { listCards, listCanData } from '../../../graphql/queries'
import { updateCard, createCard } from '../../../graphql/mutations'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = { title: '', type: '', period: '', CSSId: '', isDisplayed: false};
const SIGNAL_LIMIT = 5000;
const Cards = (dID) => {
    const [cardData, setCardData] = useState([]);
    const [deviceID, setDeviceID] = useState(dID.dId);
    const [displayCard, setDisplayCard] = useState(dID.disp)
    const [card, setCard] = useState(initialState);
    const typeList = ['Max', 'Min', 'Average'];
    const periodList = ['Last 24 Hours', 'Last Week', 'Last Month', 'Last Year'];
    const [signals, setSignals] = useState([]);

    useEffect(() => {
        generateCards()
        setDisplayCard(dID.disp)
    }, [dID])

    useEffect(() => {
        getSignalList();
    },[]);

    async function createNewCard() {
        if(!card.title || !card.type || !card.period) return
        await API.graphql({
            query: createCard,
            variables: { input: card}
        });
        notify("Card Added");
        setDisplayCard(false);
        await generateCards();
    }
    

    const cancelCard = (e) =>
    {
        setDisplayCard(false);
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


    function onChange(e) {
        setCard(() => ({ ...card, [e.target.name]: e.target.value}));
    }

    async function getSignalList() {
        let filterStr = {deviceID: {eq: deviceID}};
        const signalList = await API.graphql({
            query: listCanData, variables: {filter: filterStr, limit: SIGNAL_LIMIT}});
        const signalSet = [...new Set(signalList.data.listCanData.items.map(item => item.Signal))];
        setSignals(signalSet);
        setCard(() => ({...card, 'signal': signalSet[0], 'type': 'Max', 'period': 'Last 24 Hours', 'CSSId': deviceID, 'isDisplayed': true}));
    }

    async function deleteCardByID(cardEl)
    {
        var cardId = cardEl.target.name.split("!")[0].toString();
        var versionNum = cardEl.target.name.split("!")[1].toString();
        const cardDetails = {id: cardId, isDisplayed: false, _version: versionNum};
        await API.graphql({
            query: updateCard, 
            variables: {input: cardDetails}});
        await generateCards();
    }
    async function generateCards() 
    {
        let filterStr = {deviceID: {eq: deviceID}};
        const data = await API.graphql({
            query: listCanData, variables: {filter: filterStr}});
        let filterStr2 = {CSSId: {eq: deviceID}};
        const cards = await API.graphql({
            query: listCards,
            variables: {filter: filterStr2}
        });
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
    return (
        <div>
            {displayCard == true && (
            <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
                
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
                <Row>
                    <Col xs={1}>
                        <button style={{ color: 'blue'}}
                        onClick={createNewCard}> Add Card </button>
                    </Col>
                    <Col>
                    <button style={{ color: 'blue'}}
                        onClick={cancelCard}> Cancel </button>
                    </Col>
                </Row>

                <h1>
                    {"\n"}
                </h1>

            </div>
            )}
            <Container>


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

export default Cards