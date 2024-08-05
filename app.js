const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "CandidateAdded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "startVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stopVoting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "candidate",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"name": "VoteCasted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCandidates",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "candidate",
				"type": "string"
			}
		],
		"name": "getVoteCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "votes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "votingActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        // Request account access if needed
        await ethereum.request({ method: 'eth_requestAccounts' });

        // Create a Web3 instance
        const web3 = new Web3(window.ethereum);

        // Create a contract instance
        const contract = new web3.eth.Contract(abi, contractAddress);

        // Load candidates and display them
        loadCandidates(contract);

        // Bind vote function to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const candidateId = parseInt(event.target.getAttribute('data-id'));
                vote(contract, candidateId);
            });
        });
    } else {
        alert('Please install MetaMask!');
    }
});

async function loadCandidates(contract) {
    const candidatesCount = await contract.methods.candidatesCount().call();
    let candidatesDiv = document.getElementById('candidates');

    for (let i = 1; i <= candidatesCount; i++) {
        let candidate = await contract.methods.getCandidate(i).call();
        candidatesDiv.innerHTML += <p>Candidate ${i}: ${candidate[0]} - Votes: ${candidate[1]}</p>;
    }
}

async function vote(contract, candidateId) {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    try {
        await contract.methods.vote(candidateId).send({ from: accounts[0] });
        alert("Vote cast successfully!");
        location.reload(); // Reload to update vote counts
    } catch (error) {
        console.error(error);
        alert("An error occurred while casting your vote.");
    }
}