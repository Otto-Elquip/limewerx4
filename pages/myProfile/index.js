import { useState , useEffect} from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Navbar2 from "../components/Navbar";
import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import { listAccounts } from '../../graphql/queries';
import { createAccount } from '../../graphql/mutations';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import Profile from './profile';
const initialState =
{
    AccountName: '',
    EmailAddr: '',
    CognitoUserName: '',
    BusinessName: '',
    AuthLvl: 0,
}

 function Home({ signOut, user}){
    const [authenticated, setAuthenticated] = useState();
    const [newAccount, setNewAccount] = useState(initialState);
    const [accountExists, setAccountExists] = useState();
    const [account, setAccount] = useState();

    useEffect(() => {
      checkAuth(user);
      getAccount(user);
    }, [])

    const checkAuth = (u) =>
    {
      Promise.all([Auth.currentUserCredentials()])
      .then( result => {
        const [a] = result;
        console.log(a)
        if(a.authenticated == true)
        {
          setAuthenticated(true);
        }
        if(a.authenticated == undefined)
        {
          setAuthenticated(false);
        }
      })
    }

    async function getAccount(u)
    {
       let filterStr = {CognitoUserName: {eq: u.username}};
       const acc = await API.graphql({
         query: listAccounts, variables: {filter: filterStr}
       });
       if(acc.data.listAccounts.items.length > 0)
       {
         setAccountExists(true);
         setAccount(acc.data.listAccounts.items[[0]]);
         
       }
       else
       {
         setAccountExists(false);
         setAccount({});
         setNewAccount(() => ({...newAccount, EmailAddr: u.attributes.email, CognitoUserName: u.username}));
       }
    }

    async function createNewAccount() 
    {
      if(!newAccount.AccountName) 
      {
          notify('Error Adding Account, Please fill in an Account Name');
          return;
      }

      var PostResult = await API.graphql({
        query: createAccount,
        variables: { input: newAccount}
      });

      if(PostResult.data != undefined)
      {
          notify('Account Successfully Created');
      }
      else
      {
          notify('Error Adding Account, Please Try Again');
      }
      await getAccount(user);
    }

    function onChange(e){
        setNewAccount(() => ({...newAccount, [e.target.name]: e.target.value}));
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
    return(
        <>
            <Navbar2 authenticated={authenticated}/>
            <div style={{paddingLeft: '15px', paddingRight: '15px'}}>
              {accountExists == false && (
                  <>
                                    
                    <h3 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Create Account</h3>
                    <button onClick={signOut}> sign out</button>
                    <h3 className="text-1xl font=semibold tracking-wide mt-6"> Account Name *</h3>
                    <input
                        onChange={onChange}
                        name="AccountName"
                        placeholder="Account Name"
                        value={newAccount.AccountName}
                        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light
                        text-gray-500 placeholder-gray-500 y-z">
                    </input>
                    <h3 className="text-1xl font=semibold tracking-wide mt-6"> Business Name</h3>
                    <input
                        onChange={onChange}
                        name="BusinessName"
                        placeholder="Business Name"
                        value={newAccount.BusinessName}
                        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light
                        text-gray-500 placeholder-gray-500 y-z">
                    </input>
                    <button style={{color: 'blue' }}
                    onClick={createNewAccount}> Create Account </button>
                   
                  </>
              )}
              {accountExists == true && (
                <>
                   <h3 className="text-3xl font-semibold tracking-wide mt-6 mb-2">My Profile</h3>
                   <h3 className="text-1xl  tracking-wide mt-6 mb-2">Account Name: {account.AccountName}</h3>
                   <h3 className="text-1xl  tracking-wide mt-6 mb-2">Business Name: {account.BusinessName}</h3>
                   <h3 className="text-1xl  tracking-wide mt-6 mb-2">Email: {account.EmailAddr}</h3> 
                   <button onClick={signOut} style={{color: 'blue'}}> sign out</button>          
                </>
              )}
            </div>
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

    )
}

export default withAuthenticator(Home)