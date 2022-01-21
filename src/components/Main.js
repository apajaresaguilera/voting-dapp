import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers';
import contractJson from '../abis/contractAbi.json';
import Modal from 'react-bootstrap/Modal';
export default function Main() {

    const [account, setAccount] = useState("");
    const [signer, setSigner] =  useState(null);
    const [totalElections, setTotalElections] = useState([]);
    const provider =  new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x391Ebcbce118DA713F2B295257fe969B87000ff7";
    const [contract, setContract] = useState(new ethers.Contract(contractAddress, contractJson.abi, provider))
    const [show, setShow] = useState(false);
    const [selectedElection, setSelectedElection] = useState("");
    const [selectedIndex, setSelectedIndex] = useState("");
    const [selectedCandidates, setSelectedCandidates] = useState([]);
  const handleClose = () => setShow(false);
 
    const signUpAsCandidate = async (event) => {
       event.preventDefault();
       console.log('sign up')
       try{
        const electionTxn = await contract.signUpAsCandidate(event.target.name.value, event.target.surname.value);        
        await electionTxn.wait() 
       }catch(e){
           alert(e.error.message)
       }
       
    }

    const handleChange = () => {
 
    }
    const addElection = async (event) => {
        
        event.preventDefault();
        const startDate = parseInt((new Date(event.target.startingDate.value).getTime() / 1000).toFixed(0));
        const regPeriod = parseInt((new Date(event.target.regPeriod.value).getTime() / 1000).toFixed(0));
        const votPeriod = parseInt((new Date(event.target.votPeriod.value).getTime() / 1000).toFixed(0));
        const electionTxn = await contract.startElection(event.target.name.value,startDate, regPeriod,votPeriod);        
        await electionTxn.wait()
        console.log('election added!')
        getElections(); 
    }
    const isMetaMaskConnected = async () => {

        const accounts = await provider.listAccounts();
        const signer = provider.getSigner();
        if(accounts.length > 0){
            setAccount(accounts[0]);
            setSigner(signer)
            setContract(new ethers.Contract(contractAddress, contractJson.abi, signer))
           
        }else{
            setAccount("");
        }
    }
    const getElections = async () => {
        
        const totalElectionsCount = await contract._electionCounter();     
        let arr = [];
        for (let i = 0; i < totalElectionsCount; i++) {
            let electionAux = await contract.elections(i)

            arr.push(
                 {
                    "electionName": electionAux.electionName,
                    "electionStart":electionAux.electionStart.toString(),
                    "endingTime":electionAux.endingTime.toString(),
                    "registrationPeriod":electionAux.registrationPeriod.toString(),
                    "votingPeriod":electionAux.votingPeriod.toString(),
                } 
            
            )
        
       
        } 
        
         setTotalElections(arr);
        
        console.log(totalElections) 

    }

    useEffect(()=>{
        isMetaMaskConnected();
    getElections();

    }, [])
    const handleVote = async () => {
        setShow(false);
    }
    const handlePresent = async () => {
        try{
            const presentingTxn = await contract.registerToElection(selectedIndex);        
            await presentingTxn.wait() 
            console.log('candidate added to election!')
           }catch(e){
               alert(e.error.message)
           }
         
       
    }
    const handleElectionClick = async (election, index) => {
        setSelectedIndex(index)
        setSelectedElection(election)
        setShow(true);
    }
    const extractDate = (dateVal) => {
        var a = new Date(dateVal * 1000)
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        
        var time = date + ' ' + month + ' ' + year  ;
        return time;
    }
    return (
        <div className="main-container">
            <div className="input-data-container">
                <form className="election-creation-container" >
                    <h3 className='fieldtext'>Start an election!</h3>

                        <label className='fieldtext'>
                            Election name: 
                            
                        </label>
                        <input type="text" name="name" className="form-control" onChange={handleChange} />
                        <label className='fieldtext'>
                            Election starting date:
                           
                        </label>
                        <input type="date" name="startingDate" className="form-control" onChange={handleChange} />
                        <label className='fieldtext'>
                            Election registration period until:
                        </label>
                        <input type="date" name="regPeriod" className="form-control" onChange={handleChange} />

                        <label className='fieldtext'>
                            Election voting period until:
                        </label>
                        <input type="date" name="votPeriod" className="form-control" onChange={handleChange} />
                     
                        <button className="btn " onClick={addElection}>Add election</button>
                </form> 
                <form className="candidate-creation-container" onSubmit={signUpAsCandidate}>
                    <h3 className='fieldtext'>Register as candidate!</h3>

                        <label className='fieldtext'>
                            Name: 
                        </label>
                        <input type="text" name="name" className="form-control" onChange={handleChange} />
                        <label className='fieldtext'>
                            Surname
                        </label>
                        <input type="text" name="surname" className="form-control" onChange={handleChange} />
                        <button className='btn '>Register</button>
                </form> 
            </div>
            <h3>Active elections:</h3>

             <div className="glass-container">
                
                
                    {totalElections.map((election, index) =>(
                
                        <div className="card-container" onClick={()=>handleElectionClick(election, index)}>
                            
                            <h5>{election.electionName}</h5>
                            <h6>Starting date: {extractDate(election.electionStart)}</h6>
                            <h6>Registration period start: {extractDate(election.registrationPeriod)}</h6>
                            <h6>Voting period start: {extractDate(election.votingPeriod)}</h6>
                            <h6>Election end date: {extractDate(election.endingTime)}</h6>
                        </div>
                    
                    ))}
         
                    <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedElection.electionName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> 
                        <div className="modal-container">
                            <h6>Starting date: {extractDate(selectedElection.electionStart)}</h6>
                            <h6>Registration period start: {extractDate(selectedElection.registrationPeriod)}</h6>
                            <h6>Voting period start: {extractDate(selectedElection.votingPeriod)}</h6>
                            <h6>Election end date: {extractDate(selectedElection.endingTime)}</h6>
                            <div className="presented-candidates-container">
                            
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <button className='btn'  onClick={handleClose}>
                        Close
                    </button>
                    <button className='btn'  onClick={handleVote}>
                        Vote
                    </button> 
                    <button className='btn'  onClick={handlePresent}>
                        Present to election
                    </button>
                    </Modal.Footer>
                </Modal>
               
                 
                 
            </div>
        </div>
       
    )
    
}
