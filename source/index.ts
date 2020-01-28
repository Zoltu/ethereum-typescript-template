import fetch from 'node-fetch'
import { FetchJsonRpc } from '@zoltu/ethereum-fetch-json-rpc'
import { ethereum } from '@zoltu/ethereum-crypto'
import { Erc20 } from './generated/my-token'
import { DependenciesImpl } from './dependencies'
import { MnemonicSigner } from './mnemonic-signer'
import { attoString } from './utils'

async function main() {
	const jsonRpcEndpoint = 'http://localhost:8545'
	const contractAddress = 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2n
	const signer = await MnemonicSigner.create(['zoo', 'zoo', 'zoo', 'zoo', 'zoo', 'zoo', 'zoo', 'zoo', 'zoo', 'zoo', 'zoo', 'wrong'])
	const rpc = new FetchJsonRpc(jsonRpcEndpoint, fetch, { signatureProvider: signer.sign })
	const dependencies = new DependenciesImpl(rpc)
	const token = new Erc20(dependencies, contractAddress)

	const signerAddressString = await ethereum.addressToChecksummedString(signer.address)
	console.log(`Signer Address: ${signerAddressString}`)
	console.log(`Token Supply: ${attoString(await token.totalSupply_())}`)
	console.log(`User Balance: ${attoString(await token.balanceOf_(signer.address))}`)
}

if (require.main === module) {
	// necessary so @peculiar/webcrypto looks like browser WebCrypto, which @zoltu/ethereum-crypto needs
	import('@peculiar/webcrypto')
		.then(webcrypto => (globalThis as any).crypto = new webcrypto.Crypto())
		.then(main)
		.catch(error => {
			console.error(error)
			process.exit(1)
		})
}
