import { useState, useEffect, React} from "react";
import { API } from 'aws-amplify';
import { listCanData} from '../../../graphql/queries'
import { CSVLink } from 'react-csv'

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

const CSVDownload = (deviceID) => {
    const [csvData, setCSVData] = useState(initialCSVState);
    useEffect(() => {
        fetchCanData()
      }, [deviceID]);

      async function fetchCanData() {
        let filterStr = {deviceID: {eq: deviceID}};
        const data = await API.graphql({
            query: listCanData, variables: {filter: filterStr}});
          
        const todayDate = new Date();
        var csvReportContent = initialCSVState;
        if(data.data.listCanData.items.length != 0)
        {
            csvReportContent = {
                filename: `${deviceID}-${todayDate.toDateString()}.csv`,
                headers: csvHeaders,
                data: data.data.listCanData.items
            };
        }

        setCSVData(csvReportContent);
      }
      return (
        <CSVLink {...csvData}> Download Table Data to CSV</CSVLink>
      )
}

export default CSVDownload