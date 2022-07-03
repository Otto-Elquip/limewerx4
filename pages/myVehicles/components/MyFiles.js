import { useState, useEffect, useRef } from 'react'
import { API, Storage } from 'aws-amplify'
import { createUploadFile, updateUploadFile } from '../../../graphql/mutations'
import { listDevices, listUploadFiles, listAccounts } from '../../../graphql/queries'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container }from 'react-bootstrap';

const MyFiles = (deviceID) => {
    const [file, setFile] = useState(null);
    const [device, setDevice] = useState(deviceID.deviceID)
    const hiddenFileInput = useRef(null);
    const [displayFiles, setDisplayFiles] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        fetchFiles(deviceID.deviceID);
    },[deviceID])

    useEffect(() => {
        getUserName(deviceID.userID.attributes.sub);
    },[])

    async function getUserName(userId)
    {
        let filterStr = {CognitoUserName: {eq: userId}};
        const acc = await API.graphql({
          query: listAccounts, variables: {filter: filterStr}
        });
        if(acc.data.listAccounts.items.length > 0)
        {
            setUserName(acc.data.listAccounts.items[0].AccountName);
        }
    }
    async function fetchFiles(dID)
    {
        let filterStr = {CSSId: {eq: dID}};
        const devices = await API.graphql({
            query: listDevices, variables: {filter: filterStr}
        });
        var filesList = []
        for (const d of devices.data.listDevices.items)
        {
            var filterStr2 = {deviceID: {eq: d.id}};
            const uploadedFiles = await API.graphql({
                query: listUploadFiles,
                variables: {filter: filterStr2}
            });
            var files = uploadedFiles.data.listUploadFiles.items;
            console.log(files)
            filesList.push(files.filter(x => x.isDeleted == false))
        }
        setDisplayFiles(filesList.flat()) 
    }

    async function downloadFile(e)
    {
        var tempKey = e.target.name
        const signedURL = await Storage.get(tempKey, {
            level: 'public',
            download: true,
          });

        const url = URL.createObjectURL(signedURL.Body);
        const a = document.createElement('a');
        a.href = url;
        a.download = tempKey || 'download';
        const clickHandler = () => {
            setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', clickHandler);
            }, 150);
        };
        a.addEventListener('click', clickHandler, false);
        a.click();
        return a;
    }

    async function createFile()
    {
        let filterStr = {CSSId: {eq: device}}
        const dID = await API.graphql({
            query: listDevices,
            variables: {filter: filterStr}
        });
        if(!file)
        {
            notify("Please choose a file to upload")
            return;
        }
        var fileInput = {
            'deviceID': dID.data.listDevices.items[0].id, 
            'UploadedBy': userName,
            'FileName': file.name, 
            'isDeleted': false
        };
        var PostResult = await API.graphql({
            query: createUploadFile,
            variables: { input: fileInput }
        });
        if(PostResult.data == undefined)
        {
            notify('Error Adding File, Please Try Again');
            return;
        }
        
        await Storage.put(file.name, file);
        notify('File Uploaded');
        setFile(null);
        await fetchFiles(device);
    }

    async function uploadFile()
    {
        hiddenFileInput.current.click()
    }

    function handleChange(e) 
    {
        const fileUploaded = e.target.files[0];
        if(!fileUploaded) return;
        setFile(fileUploaded);
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
    async function deleteFileByID(f)
    {
        var fileID = f.target.name.split("!")[0].toString();
        var versionNum = f.target.name.split("!")[1].toString(0);
        const fileDetails = {
            id: fileID,
            isDeleted: true,
            _version: versionNum
        };
        
        console.log(fileDetails)
        await API.graphql({
            query: updateUploadFile,
            variables: {input: fileDetails}
        });
        notify("File Deleted");
        await fetchFiles(device);
    }
    return(
        <div>
            <input key={501}
                type='file'
                ref={hiddenFileInput}
                className='absolute w-0 h-0'
                onChange={handleChange}>
            
            </input>

            <Container key={101} className="justify-content-left">
                <Row key={301}> 
                    <Col key={11} xs={1}>                
                        <button style={{color: 'blue'}}
                            onClick={uploadFile}>
                            Add File
                        </button>
                    </Col>
                    <Col key={12} xs={2}>
                        {file != null &&(
                            <button style={{color: 'blue'}}
                                onClick={createFile}>
                                Upload File
                            </button>
                        )}
                    </Col>
                </Row>
                <Row key={302}>
                    <Col key={13} xs={3}>
                        {file != null && (
                            file.name
                        )}
                    </Col>

                </Row>
                <Row>
                    <Col key={14}>
                        <h6 className="font-semibold">
                            File
                        </h6>
                    </Col>
                    <Col key={15}xs={1}>
                        
                    </Col>
                    <Col key={16}>
                        <h6 className="font-semibold">
                            Uploaded By
                        </h6>
                    </Col>
                    <Col key={17}>
                        <h6 className="font-semibold">
                            Upload Time
                        </h6>
                    </Col>

                </Row>
                <hr style={{color: 'black', height: 2}} />
            </Container>
            <Container key={102}>
                
                {displayFiles.map((f, k) => (
                    <Row>
                        <Col key={1} xs={3}>
                            <button
                                style={{color: 'blue' }}
                                key={k}
                                name={`${f.FileName}`}
                                onClick={downloadFile}>
                            {f.FileName}
                            </button>
                        </Col>
                        <Col key={2} xs={1}>
                            <button name={`${f.id}!${f._version}`}
                            className="justify-content-md-center"
                            onClick={deleteFileByID}>🗑️</button>
                        </Col>
                        <Col key={3}>
                            {f.UploadedBy}
                        </Col>
                        <Col key={4}>
                            {f.createdAt}
                        </Col>

                        <hr style={{color: 'black', height: 2}} />
                    </Row>
                ))}
                    
                    
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

export default MyFiles