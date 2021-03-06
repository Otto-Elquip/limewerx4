import { useState, useEffect } from "react";
import { listCanData } from '../../../graphql/queries'
import { API } from 'aws-amplify'

export default function Home({deviceList}){
  const [dList, setDList] = useState([])
  const [deviceID, setDeviceID] = useState()
  const [canData, setCanData] = useState([])
  useEffect(() => {
    fetchCanData()
  }, [deviceID]);

  console.log(deviceList)

  async function fetchCanData() {
    let filterStr = {deviceID: {eq: '1234ABCD'}};
    const data = await API.graphql({
      query: listCanData, variables: {filter: filterStr}});
      setCanData(data.data.listCanData.items);
  }

  let handleDeviceChange = (e) => {
    setDeviceID(e.target.value)
  };

  return (
      <select style={{paddingTop: '10px', paddingLeft: '15px'}} onChange={handleDeviceChange}>
        <option value="Select a vehicle">---Select a Vehicle---</option>
        {dList.map((device) => <option key={device.id} value={device.CSSId}>{device.Vehicle}</option>)}
      </select>   
  )

}