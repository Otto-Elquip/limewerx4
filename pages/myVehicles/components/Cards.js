import { useState, useEffect, React} from "react";
import { Card, Row, Col, Container }from 'react-bootstrap';
import { setDatasets } from "react-chartjs-2/dist/utils";



const Cards = (cardData, canData) => {

    const [cards, setCards] = useState([]);
    const [can, setCan] = useState([]);

    useEffect(() => {
        setData(cardData, canData);
    }, [cardData, canData])

    const setData = (cardData, canData) => {
        setCards(cardData);
        setCan(canData);
    }
    
    return 
    (
        <>
        </>
    );

}

export default Cards