import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers';

export default function Main() {

    const [account, setAccount] = useState("");

    const provider =  new ethers.providers.Web3Provider(window.ethereum, "any");
    const contractAddress = "0x...";
    const contract =  new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

    

    const handleChange = () => {

    }
    const addElection = async (event) => {
        await contract.startElection(event.target.name.value, parseInt((event.target.startingDate.value.getTime() / 1000).toFixed(0)),parseInt((event.target.regPeriod.value.getTime() / 1000).toFixed(0)),parseInt((event.target.votPeriod.value.getTime() / 1000).toFixed(0)));
    }
    const isMetaMaskConnected = async () => {
        const accounts = await provider.listAccounts();
        if(accounts.length > 0){
            setAccount(accounts[0]);
        }else{
            setAccount("");
        }
    }
    useEffect(()=>{
        isMetaMaskConnected();
      
    }, [])
    return (
        <div className="main-container">
             <div className="glass-container">
                Current elections
            </div>
            <div className="glass-container ">
                <form className="election-creation-container" onSubmit={addElection}>
                <h3 className='fieldtext'>Start an election!</h3>

                    <label className='fieldtext'>
                        Election name: 
                        <input type="text" name="name" onChange={handleChange} />
                    </label>
                    <label className='fieldtext'>
                        Election starting date:
                        <input type="date" name="startingDate" onChange={handleChange} />
                    </label>
                    <label className='fieldtext'>
                        Election registration period until:
                        <input type="date" name="regPeriod" onChange={handleChange} />
                    </label>
                    <label className='fieldtext'>
                        Election voting period until:
                        <input type="date" name="votPeriod" onChange={handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
            </form> 
            </div>
        </div>
       
    )
}
