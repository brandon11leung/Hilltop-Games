/************************************************************************************
 * Name        : listings.js (data)
 * Author      : Brandon Leung
 * Date        : April 17, 2023
 * Description : Final Project listings data function implementation.
 * Pledge      : I pledge my honor that I have abided by the Stevens Honor System.
 ***********************************************************************************/
// This data file should export all functions using the ES6 standard as shown in the lecture code
import {listings} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import * as helpers from '../helpers.js';
import * as pricecharting from '../utils/pricecharting.js'
import timestamp from "time-stamp";

export const create = async (posterId, title, listingType, mainCondition, secondaryCondition, price, attachments, trades, shippingPrice, shippingMethods, description, returnPolicy, currency, pricechartingID) => {
	posterId = helpers.isValidID(posterId);
    title = helpers.isValidString(title);
	listingType = helpers.isValidString(listingType);
	mainCondition = helpers.isValidString(mainCondition);
	helpers.isValidTradeArray(trades);
	if (!pricechartingID == false) {
		helpers.isValidNumber(pricechartingID);
	}
	for (let i = 0; i < trades.length; i++) {
		trades[i] = helpers.isValidString(trades[i])
	}
	helpers.isValidArray(secondaryCondition);
	for (let i = 0; i < secondaryCondition.length; i++) {
		secondaryCondition[i] = helpers.isValidString(secondaryCondition[i]);
	}
	helpers.isValidPrice(price);
    helpers.isValidArray(shippingMethods);
	for (let i = 0; i < shippingMethods.length; i++) {
		shippingMethods[i] = helpers.isValidString(shippingMethods[i]);
    }
    description = helpers.isValidString(description);
    currency = helpers.isValidString(currency);
    helpers.isValidArray(attachments);
    returnPolicy = helpers.isValidString(returnPolicy);
    helpers.isValidPrice(shippingPrice);

    if (listingType == "Buy") {
        shippingPrice = 0;
    }

	let newListing = {
		posterId: new ObjectId(posterId),
        open: true,
        listingType: listingType,
		title: title,
		timeStampPosted: timestamp('YYYY/MM/DD - HH:mm:ss'),
        timeStampUpdated: timestamp('YYYY/MM/DD - HH:mm:ss'),
		mainCondition: mainCondition,
		secondaryCondition: secondaryCondition,
		price: price,
		attachments: attachments,
		trades: trades,
		shippingPrice: shippingPrice,
		shippingMethods: shippingMethods,
		description: description,
		returnPolicy: returnPolicy,
		currency: currency,
		pricechartingID: pricechartingID,
		offers: [],
		comments: []
    };
	const listingCollection = await listings();
	const insertInfo = await listingCollection.insertOne(newListing);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) {throw new Error("Error: unable to add listing.")}
	const newId = insertInfo.insertedId.toString();
	const listing = await get(newId);
	return listing;
};


export const getAll = async () => {
	const listingCollection = await listings();
	let listingList = await listingCollection.find({}).toArray();
	if (!listingList) {throw new Error("Error: was unable to get all listings.")}
	listingList = listingList.map((element) => {
		element._id = element._id.toString();
		return element;
	});
	return listingList;
};

export const get = async (id) => {
	id = helpers.isValidString(id);
	if (!ObjectId.isValid(id)) {throw new Error("Error: invalid object ID.")}
    const listingCollection = await listings();
    const listing = await listingCollection.findOne({_id: new ObjectId(id)});
    if (listing === null) {throw new Error("Error: there is no listing with that id.")}
    listing._id = listing._id.toString();
    return listing;
};

export const remove = async (id) => {
	id = helpers.isValidID(id)
	const listingCollection = await listings();
	const deletionInfo = await listingCollection.findOneAndDelete({_id: new ObjectId(id)});
	if (deletionInfo.lastErrorObject.n === 0) {throw new Error(`Error: was unable to delete listing with id of ${id}.`)}
	return `${deletionInfo.value.title} has been successfully deleted!`;
};

export const updateStatus = async (id, open) => {
	if (typeof(open) !== "boolean") {throw new Error("Error: invalid open type.")}
	id = helpers.isValidID(id);
	const updatedListing = {
		open: open
	}
	const listingCollection = await listings();
	const updatedInfo = await listingCollection.findOneAndUpdate(
		{_id: new ObjectId(id)},
		{$set: updatedListing},
		{returnDocument: 'after'})
	if (updatedInfo.lastErrorObject.n === 0) {throw new Error("Error: unable to update the listing info.")}
		updatedInfo.value._id = updatedInfo.value._id.toString();
		return updatedInfo.value;
}

export const update = async (id, open, title, listingType, mainCondition, secondaryCondition, price, attachments, trades, shippingPrice, shippingMethods, description, returnPolicy, currency, pricechartingID) => {
	if (typeof(open) !== "boolean") {throw new Error("Error: invalid open type.")}
	id = helpers.isValidID(id);
    title = helpers.isValidString(title);
	listingType = helpers.isValidString(listingType);
	if ((listingType == "Buy" || listingType == "Sell") == false) {throw new Error("Error: invalid listing type.")}
	mainCondition = helpers.isValidString(mainCondition);
    helpers.isValidArray(secondaryCondition);
	for (let i = 0; i < secondaryCondition.length; i++) {
		secondaryCondition[i] = helpers.isValidString(secondaryCondition[i]);
	}
	if (!pricechartingID == false) {
		helpers.isValidNumber(pricechartingID, "Pricecharting ID");
	}
	helpers.isValidTradeArray(trades);
	for (let i = 0; i < trades.length; i++) {
		trades[i] = helpers.isValidString(trades[i], "Trade Array Element")
	}
	price = helpers.isValidPrice(price);
    helpers.isValidArray(shippingMethods);
	for (let i = 0; i < shippingMethods.length; i++) {
		shippingMethods[i] = helpers.isValidString(shippingMethods[i]);
	}
    description = helpers.isValidString(description);

    currency = helpers.isValidString(currency);

    const listingCollection = await listings();
    const originalInfo = await listingCollection.findOne({_id: new ObjectId(id)});
    console.log(originalInfo)
    helpers.isValidArray(attachments);
    returnPolicy = helpers.isValidString(returnPolicy);
    helpers.isValidPrice(shippingPrice);
    if (originalInfo.listingType.toLowerCase() == "buy") {
        shippingPrice = 0;
    }

	const updatedListing = {
        open: open,
		title: title,
		timeStampUpdated: timestamp('YYYY/MM/DD - HH:mm:ss'),
		mainCondition: mainCondition,
		secondaryCondition: secondaryCondition,
		price: price,
		attachments: attachments,
		trades: trades,
		shippingPrice: shippingPrice,
		shippingMethods: shippingMethods,
		description: description,
		returnPolicy: returnPolicy,
		currency: currency,
		pricechartingID: pricechartingID
	};
	const updatedInfo = await listingCollection.findOneAndUpdate(
		{_id: new ObjectId(id)},
		{$set: updatedListing},
		{returnDocument: 'after'})
	if (updatedInfo.lastErrorObject.n === 0) {throw new Error("Error: unable to update the listing info.")}
		updatedInfo.value._id = updatedInfo.value._id.toString();
		return updatedInfo.value;
};

export const searchByTitle = async (searchQuery) => {
    searchQuery = helpers.isValidString(searchQuery, "Search Query").toLowerCase();
    const listingCollection = await listings();
    const allListings = await getAll();
    let matchedListings = [];
    for (let i = 0; i < allListings.length; i++) {
        let currListingTitle = allListings[i].title.toLowerCase();
        if (currListingTitle.indexOf(searchQuery) > -1 || currListingTitle.includes(searchQuery)) {
            // matchedListings.push(allListings[i]._id);
            matchedListings.push(allListings[i]);
        }
    }
    return matchedListings;
}

export const filterByElements = async (listings, elements) => {
	let filteredListings = []
	for (let i = 0; i < listings.length; i++) {
		let matchFilter = true;
		if (typeof elements.open !== "boolean" && elements.open !== null) {
			throw new Error("Error: Open is not a boolean.");
		}
		if (elements.open == false && listings[i].open == true) {
			matchFilter = false;
		} else if (elements.open == true && listings[i].open == false) {
			matchFilter = false;
		}

		if (elements.consoles.length > 0) {
			if (listings[i].pricechartingID == null) {
				matchFilter = false;
			} else {
				for (let j = 0; j < elements.consoles.length; j++) {
					if (pricecharting.ntscConsoleArr.includes(elements.consoles[j]) == false) {
						throw new Error("Error: Invalid Console.");
					}
					let listingConsole = await pricecharting.searchByID(listings[i].pricechartingID)
					listingConsole = listingConsole["console-name"] 
					console.log(listingConsole)
					if (elements.consoles.includes(listingConsole) == false) {
						matchFilter = false;
					}
				}
				
			}
		}
	
		const validMainConditionArr = ["Brand New", "Like New/Open Box", "Used", "For Parts or Not Working"];
		if ((validMainConditionArr.includes(elements.mainCondition) == false || validMainConditionArr.includes(listings[i].mainCondition) == false) && elements.mainCondition != null) {
			throw new Error("Error: Invalid Main Condition.");
		}
		if (elements.mainCondition == "Brand New" && listings[i].mainCondition != "Brand New") {
			matchFilter = false;
		} else if (elements.mainCondition == "Like New/Open Box" && listings[i].mainCondition != "Like New/Open Box") {
			matchFilter = false;
		} else if (elements.mainCondition == "Used" && listings[i].mainCondition != "Used") {
			matchFilter = false;
		} else if (elements.mainCondition == "For Parts or Not Working" && listings[i].mainCondition != "For Parts or Not Working") {
			matchFilter = false;
		}

		const validSecondaryConditionArr = ["Cartridge", "Box", "Case", "Manual", "Console", "Controller", "Disc", "Cables", "Redemption Code"];
		if (elements.secondaryCondition.length > 0 && listings[i].secondaryCondition.length > 0) {
			let check = false;
			for (let j = 0; j < elements.secondaryCondition.length; j++) {
				if (validSecondaryConditionArr.includes(elements.secondaryCondition[j]) == false && validSecondaryConditionArr.includes(listings[i].secondaryCondition[j]) == false) {
					throw new Error("Error: Invalid Secondary Condition.");
				}
				// if (elements.secondaryCondition.includes(listings[i].secondaryCondition[j])) {
				// 	check = true;
				// }
				if (listings[i].secondaryCondition.includes(elements.secondaryCondition[j]) == false) {
					check = true;
				}
			}
			if (check == true) {
				matchFilter = false;
			}
		}
		
		const validListingTypeArr = ["Buy", "Sell", "Trade"];
		if ((validListingTypeArr.includes(elements.listingType) == false || validListingTypeArr.includes(listings[i].listingType) == false) && elements.listingType != null) {
			throw new Error("Error: Invalid Listing Type.");
		}
		if (elements.listingType == "Sell" && listings[i].listingType != "Sell") {
			matchFilter = false;
		} else if (elements.listingType == "Buy" && listings[i].listingType != "Buy") {
			matchFilter = false;
		}
		
		if (typeof elements.trades !== "boolean" && elements.trades !== null) {
			throw new Error("Error: Trades is not a boolean.");
		}
		if (elements.trades == true && listings[i].trades.length == 0) {
			matchFilter = false;
		}

		const validShippingMethodsArr = ["Shipping", "Local Meetup"];
		for (let j = 0; j < elements.shippingMethods.length; j++) {
			if (validShippingMethodsArr.includes(elements.shippingMethods[j]) == false && elements.shippingMethods != null) {
				throw new Error("Error: Invalid Shipping Method.");
			}
			if (listings[i].shippingMethods.includes(elements.shippingMethods[j]) == false) {
				matchFilter = false;
			}
		}

		
		if (typeof elements.freeShipping !== "boolean" && elements.freeShipping !== null) {
			throw new Error("Error: Free Shipping is not a boolean.");
		}
		if (elements.freeShipping == true && listings[i].shippingPrice > 0 && listings[i].listingType == "Sell") {
			matchFilter = false;
		} else if (elements.freeShipping == false && listings[i].shippingPrice == 0 && listings[i].listingType == "Sell") {
			matchFilter = false;
		}

		
		if (matchFilter == true) {
			filteredListings.push(listings[i]);
		}
	}
	return filteredListings;
}

// export const sortByElement = async (listings, element) => {
// 	// alphabettical, last updated, last posted, lowest ->high, high -> low, 
// 	if (element == "Alphabetically")
// }

export const addComment = async (Listingid, username, posterid, comment) => {
	if (typeof(comment) !== "string") {throw new Error("Error: invalid comment type.")}
	if (typeof(username) !== "string") {throw new Error("Error: invalid username type.")}
	Listingid = helpers.isValidID(Listingid);
	posterid = helpers.isValidID(posterid);
	const listingCollection = await listings();
	const newComment = {
		_id: new ObjectId(),
		listingId: Listingid,
		username: username,
		posterId: posterid,
		content: comment
	}
	let listing = await get(Listingid);
	const updatedInfo = await listingCollection.findOneAndUpdate(
		{_id: new ObjectId(Listingid)},
		{$set: {comments: listing['comments'].concat(newComment)}},
		{returnDocument: 'after'})
	if (updatedInfo.lastErrorObject.n === 0) {throw new Error("Error: unable to update the listing info.")}
		updatedInfo.value._id = updatedInfo.value._id.toString();
		return updatedInfo.value;
}

export default {create, get, getAll, remove, update, updateStatus, addComment}
