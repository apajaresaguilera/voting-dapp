import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers';
import contractJson from '../abis/contractAbi.json';
import Modal from 'react-bootstrap/Modal';
export default function Main() {

    const [account, setAccount] = useState("");
    const [signer, setSigner] =  useState(null);
    const [totalElections, setTotalElections] = useState([]);
    const provider =  new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x1b5d4115F90D552697f9C63D0cEace5832a70d61";
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
                    "electionId": i,
                    "electionName": electionAux.electionName,
                    "electionStart":electionAux.electionStart.toString(),
                    "endingTime":electionAux.endingTime.toString(),
                    "registrationPeriod":electionAux.registrationPeriod.toString(),
                    "votingPeriod":electionAux.votingPeriod.toString(),
                } 
            
            )
        
       
        } 
        
         setTotalElections(arr);
        

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
         
           getElectionCandidates(selectedIndex);
    }
    const getElectionCandidates = async (electionId) => {
        let fullCandidateList = [];
        let candidates = await contract.getCandidatesInElection(electionId);   
        for (let i = 0; i < candidates.length; i++) {
            let fullCandidate = await contract.candidates(candidates[i]);  
            let candidateVotes = await contract.getCandidateVotes(candidates[i], electionId);  
            fullCandidateList.push(
                {
                    "votes": candidateVotes.toString(),
                    "address": candidates[i],
                    "name": fullCandidate.name,
                    "surname": fullCandidate.surname
                }
            ) 
            
        }
            
        
        setSelectedCandidates(fullCandidateList);
    }

    const handleElectionClick = async (election, index) => {
        setSelectedIndex(index)
        setSelectedElection(election)
        console.log(selectedElection.electionId)
        setShow(true);
        getElectionCandidates(index);
    }
    const handleCandidateVoting = async (candidate) => {
      

        try{
            const voteTxn = await contract.voteForCandidate(candidate.address, selectedElection.electionId);
            await voteTxn.wait();
            console.log("voted!")
            alert("Voted for " + candidate.name + " " + candidate.surname +" !");
           }catch(e){
               alert(e.error.message)
           }
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
            <div className="whole-container">
                <div className="input-data-container">
                    <form className="election-creation-container" onSubmit={addElection}>
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
                        
                            <input value="Add election" className="btn " type='submit' />
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
            
                        <Modal show={show} onHide={handleClose} >
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedElection.electionName}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body > 
                            <div className="modal-container">
                                <h6>Starting date: {extractDate(selectedElection.electionStart)}</h6>
                                <h6>Registration period start: {extractDate(selectedElection.registrationPeriod)}</h6>
                                <h6>Voting period start: {extractDate(selectedElection.votingPeriod)}</h6>
                                <h6>Election end date: {extractDate(selectedElection.endingTime)}</h6>
                                <div className="presented-candidates-container">
                                {selectedCandidates.map((candidate, index) =>(
                    
                                    <div className="card-container" >
                                        <h6 className="candidate-info" >Candidate address: {candidate.address}</h6>
                                        <h6 className="candidate-info" >Candidate name: {candidate.name}</h6>
                                        <h6 className="candidate-info" >Candidate surname: {candidate.surname}</h6>
                                        <h6 className="candidate-info" >Candidate votes: {candidate.votes}</h6>
                                        <button className='btn btn-invert' onClick={()=>handleCandidateVoting(candidate)}>Vote</button>
                                    </div>
                                
                                ))}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                        <button className='btn'  onClick={handleClose}>
                            Close
                        </button>
                        <button className='btn'  onClick={handlePresent}>
                            Present to election
                        </button>
                        </Modal.Footer>
                    </Modal>
                
                    
                    
                </div>
            </div>
        </div>
       
    )
    
}
