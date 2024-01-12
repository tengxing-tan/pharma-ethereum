
**File directories**
```
.  
├── hardhat  
└── next-app 
```

* `hardhat`: write & debug smart contract
* `next-app:` Full stack web deployment
## Get Started

```bash
# Installation
cd ./next-app && pnpm install;
cd ../hardhat && pnpm install;

# At /hardhat
# start local blockchain node
npx hardhat node

# deploy contract
npx hardhat run scripts/deploy-verify.js --network localhost

# copy contract target address to /next-app/.env.local
code /next-app/.env.local

# ensure that DATABASE is on, ie mysql
# edit .env for db setup
code /next-app/.env

# see the result
cd /next-app;
pnpm build && pnpm start;

# development
pnpm dev
```

## Revision
### ethers.js: Interact with Smart Contract

```bash
pnpm add ethers
```

Read data from contract
```ts
import { ethers } from "ethers";
// get stakeholder.json from /hardhat/artifacts/build/Stakeholder/stakeholder.json
import stakeholderJson from "@/_utils/Stakeholder.json";

function getStakeholder() {
	// Prepare contract
	// aware the env variables:
	// HARDHAT_RPC_URL, STAKEHOLDER_CONTRACT_ADDRESS
	const provider = new ethers.JsonRpcProvider(process.env.HARDHAT_RPC_URL);
	const contract = new ethers.Contract(
		process.env.STAKEHOLDER_CONTRACT_ADDRESS ?? '', 
		stakeholderJson.abi, 
		provider
	);

	// initiate contract
	const tx = await contract.getStakeholder(metaMaskAccount);
	
	// convert object to json
	const user = {
	        email: tx.email,
	        metamaskAccount: tx.metamaskAccount,
	        registeredAt: tx.registeredAt 
		        ? new Date(Number(tx.registeredAt) * 1000).toString() 
		        : null,
	        verifiedAt: tx.verifiedAt 
		        ? new Date(Number(tx.verifiedAt) * 1000).toString() 
		        : null,
	        isAuthentic: tx.isAuthentic
	    }
	}
	return user
}
```

**Setter of Smart Contract:**
Create contract instance with signer, instead of provider.
```ts
// with signer (solution)
const contract = new ethers.Contract(contractAddress, abi.abi, signer);
await contract.updateUser()

// with provider (causing error)
const contract = new ethers.Contract(contractAddress, abi.abi, provider);
```

### Seed database: 
package name: `@swc-node/register` (to compile typescript files)
```json
// package.json
"prisma": {
	"seed": "node -r @swc-node/register prisma/seed.ts"
},
```

### Existing app: IBM Blockchain Demo
https://www.ibm.com/blockchain/resources/transparent-supply/demo/trace

