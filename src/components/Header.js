import React, {useState, useEffect} from 'react'
import {ethers} from 'ethers';

export default function Header() {
    const [account, setAccount] = useState("");
    const provider =  new ethers.providers.Web3Provider(window.ethereum, "any");
    const {ethereum} = window;

    const connectWallet = async () => {
       let account = await ethereum.request({method: 'eth_requestAccounts'})
       setAccount(account)
       return account;
    }
    const isMetaMaskConnected = async () => {
        console.log('checking...')
        const accounts = await provider.listAccounts();
        if(accounts.length > 0){
            setAccount(accounts[0]);
        }else{
            setAccount("");

        }
    }
    const handleAccountsChanged = (accounts) => {
        isMetaMaskConnected();
      };
    useEffect(()=>{
        ethereum.on('accountsChanged', handleAccountsChanged);
        isMetaMaskConnected();
        return () => {
            window.removeEventListener('accountsChanged',handleAccountsChanged);
          };
    }, [])
    
    return (
        <div class="headerContainer"  >
        
            {account ? 
                 <button type="button" class="btn btn-disable"  >Connected!</button>
                :
                <button type="button" class="btn" onClick={connectWallet}>Connect Wallet</button>
            }
            <div class="title-mid"></div> 
            <h3 id="dappTitle" class="title-right">The Voting DApp! 🗳️</h3>
                
           
        </div>
    )
    
}
