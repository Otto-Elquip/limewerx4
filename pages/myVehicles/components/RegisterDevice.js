import { useState , useEffect} from "react";
import { API } from 'aws-amplify';
import { createDevice } from '../../../graphql/mutations';
import { listAccounts } from '../../../graphql/queries';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Col }from 'react-bootstrap';


const initialState =
{
    CSSId: '',
    Location: '',
    Vehicle: '',
    isAcive: true,
    DateActivated: '',
    accountID: ''
}


function RegisterDevice(AccountId, disp)
{
    const [newDevice, setNewDevice] = useState(initialState);
    const [display, setDisplay] = useState(AccountId.disp);
    const [id, setId] = useState();

    useEffect(() => {
        setInitParams(AccountId.AccountId);
    }, [])

    async function setInitParams(accId)
    {
        let filterStr = {CognitoUserName: {eq: accId}}
        const accountList = await API.graphql({
            query: listAccounts, 
            variables: {filter: filterStr}
        })
        var userId = accountList.data.listAccounts.items[0].id
        var dateNow = new Date();
        var dateStr = dateNow.toString();
        setNewDevice(() => ({...newDevice, DateActivated: dateStr, accountID: userId}));
    }

    function Cancel()
    {
        setDisplay(false);
    }

    async function createNewDevice()
    {
        console.log(newDevice)

        if(!newDevice.CSSId || !newDevice.Vehicle) 
        {
            notify('Error RegisteringDeivce, Please ensure all mandatory fields are filled');
            return;
        }
  
        var PostResult = await API.graphql({
          query: createDevice,
          variables: { input: newDevice}
        });
  
        if(PostResult.data != undefined)
        {
            notify('Device Successfully Registered');
        }
        else
        {
            notify('Error Registering Device, Please Try Again');
        }
    }

    function onChange(e){
        setNewDevice(() => ({...newDevice, [e.target.name]: e.target.value}));
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
    return(
        <> 
            {display == true && (
                <>
                    <h3 className="text-3xl font-semibold tracking-wide mt-6 mb-2"> Register Device </h3>
                    <h6 className="text-1xl font=semibold tracking-wide mt-6"> CSS ID *</h6>
                    <input
                        onChange={onChange}
                        name="CSSId"
                        placeholder="CSS ID as it appears on the device sticker"
                        value={newDevice.CSSId}
                        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light
                        text-gray-500 placeholder-gray-500 y-z">
                    </input>
                    <h6 className="text-1xl font=semibold tracking-wide mt-6"> Vehicle *</h6>
                    <input
                        onChange={onChange}
                        name="Vehicle"
                        placeholder="The name of the vehicle the CSS Box is installed on"
                        value={newDevice.Vehicle}
                        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light
                        text-gray-500 placeholder-gray-500 y-z">
                    </input>
                    <h6 className="text-1xl font=semibold tracking-wide mt-6"> Location *</h6>
                    <input
                        onChange={onChange}
                        name="Location"
                        placeholder="Location the vehicle is working at"
                        value={newDevice.Location}
                        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light
                        text-gray-500 placeholder-gray-500 y-z">
                    </input>
                    <Col>
                    <button 
                        style={{color: 'blue', paddingLeft: '10px', paddingRight: '10px'}}  
                        onClick={createNewDevice}> Create Device |  </button>
                    <button 
                        style={{color: 'blue'}}  
                        onClick={Cancel}> Cancel  </button>
                    
                    </Col>

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
        </>
    )

}

export default RegisterDevice