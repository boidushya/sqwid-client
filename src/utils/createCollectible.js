import axios from "axios";
import { Interact } from "./connect";
import { ethers } from 'ethers';
import marketplaceABI from '../constants/contracts/SqwidMarketplace';
import collectibleABI from '../constants/contracts/SqwidERC1155';
//eslint-disable-next-line
import { fetchMarketplaceItem, fetchMarketplaceItems } from "./marketplace";
import { isMarketplaceApproved, approveMarketplace } from "./marketplaceApproval";
import { getContract } from "./network";
import { create as ipfsHttpClient } from "ipfs-http-client";
// import { getInfuraURL } from "./getIPFSURL";
// import getMetaById from "./getMetaById";

//eslint-disable-next-line
const createCollectibleOld = async (files) => {
	const { file, coverFile, name, description, properties, collection } = files;
	const copies = Number (files.copies) || 1;
	const royalty = (Number (files.royalty) || 0) * 100;

	const data = new FormData();
	data.append("fileData", file);
	data.append("coverData", coverFile);
	data.append("name", name);
	data.append("description", description);
	data.append("collection", collection);
	let props = {};
	if (properties && properties.length > 0) {
		for (let p of properties) {
			p.key.length && (props[p.key] = p.value);
		}
	}
	data.append("properties", JSON.stringify(props));
	const address = JSON.parse(localStorage.getItem("auth"))?.auth.address;
	let jwt = address ? JSON.parse(localStorage.getItem("tokens")).find(token => token.address === address) : null;

	const approved = await isMarketplaceApproved ();
	if (!approved) {
		await approveMarketplace ();
	}

	// console.log ('wot');
	// const items = await fetchMarketplaceItems ();
	// console.log (items);

	//eslint-disable-next-line
	// const item = await fetchMarketplaceItem (1);

	if (jwt) {
		try {
			const metadata = await axios.post(`${process.env.REACT_APP_API_URL}/create/collectible`, data, {
				headers: {
					'Authorization': `Bearer ${jwt.token}`
				}
			});
			const uri = metadata.data.substring (7);
			let { signer } = await Interact (address);
			const to = await signer.getAddress ();
			let contract = new ethers.Contract (
				getContract ('reef_testnet', 'marketplace'),
				marketplaceABI,
				signer
			);
			try {
				const nft = await contract.mint (to, copies, uri, to, royalty, getContract ('reef_testnet', 'erc1155'));
				// eslint-disable-next-line
				const receipt = await nft.wait ();
				const itemId = await contract.currentId ();
				return Number (itemId);
				// try {
				// 	const verification = await axios ({
				// 		method: 'get',
				// 		url: `${process.env.REACT_APP_API_URL}/create/collectible/sync`,
				// 	});
				// 	return verification.data;
				// } catch (e) {
				// 	return null;
				// }
			} catch (err) {
				return null;
			}
		} catch (err) {
			return null;
		}
	} else return null;
}

const uploadFile = async (file) => {
	try {
		const ipfs = ipfsHttpClient ({ host: 'ipfs.infura.io', port: 5001, protocol: 'https',apiPath: '/api/v0' });
		const buffer = file.arrayBuffer ? await file.arrayBuffer () : file;
		const addedFile = await ipfs.add (buffer);
		return addedFile.path;
	} catch (err) {
		// console.log (err);
	}
}

const createCollectible = async (files) => {
	//eslint-disable-next-line
	const { file, coverFile, name, description, properties, collection } = files;
	const copies = Number (files.copies) || 1;
	const royalty = (Number (files.royalty) || 0) * 100;

	let attribs = [];
	if (properties && properties.length > 0) {
		for (let p of properties) {
			p.key.length && (attribs.push ({ trait_type: p.key, value: p.value }));
		}
	}
	let filesToUpload = [file];
	if (coverFile) filesToUpload.push (coverFile);

	const uploaded = await Promise.all (filesToUpload.map (async (f, i) => {
		return {
			url: await uploadFile (f),
			index: i
		}
	}));

	let data = {
		name,
		description,
		image: coverFile ? uploaded.find (u => u.index === 1).url : uploaded[0].url,
		media: coverFile ? uploaded.find (u => u.index === 0).url : uploaded[0].url,
		attributes: attribs
	}

	let meta = await uploadFile (JSON.stringify (data));

	const address = JSON.parse(localStorage.getItem("auth"))?.auth.address;
	//eslint-disable-next-line
	let jwt = address ? JSON.parse(localStorage.getItem("tokens")).find(token => token.address === address) : null;

	let { signer } = await Interact (address);
	const to = await signer.getAddress ();
	let marketplaceContract = new ethers.Contract (
		getContract ('reef_testnet', 'marketplace'),
		marketplaceABI,
		signer
	);
	let collectibleContract = new ethers.Contract (
		getContract ('reef_testnet', 'erc1155'),
		collectibleABI,
		signer
	);
	try {
		const nft = await collectibleContract.mint (to, copies, meta, to, royalty, true);
		const receipt = await nft.wait ();
		const tokenId = receipt.events[0].args['id'].toNumber ();

		const marketItem = await marketplaceContract.createItem (getContract ('reef_testnet', 'erc1155'), tokenId);
		const receipt2 = await marketItem.wait ();

		const itemId = receipt2.events[0].args['itemId'].toNumber ();
		return Number (itemId);
	} catch (err) {
		// console.log (err);
		return null;
	}
}

export { createCollectible };