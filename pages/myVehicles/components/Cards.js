import { useState, useEffect, React} from "react";
import { Card, Row, Col, Container }from 'react-bootstrap';
import { API } from 'aws-amplify';
import { listCards } from '../../../graphql/queries'




const Cards = (dID) => {
    const [cardData, setCardData] = useState([]);
    const [deviceID, setDeviceID] = useState(dID);

    useEffect(() => {
        generateCards()
    })

    async function generateCards() 
    {
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

  }
    return (
        <div>
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
        </div>
    )

}

export default Cards