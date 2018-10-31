const statuses = {
    "AwaitingProcessing": {
        "code": 0,
        "uiText": "Awaiting Processing"
    },
    "InTransit": {
        "code": 1,
        "uiText": "In Transit"
    },
    "Delivered": {
        "code": 2,
        "uiText": "Parcel Delivered"
    },
    "Cancelled": {
        "code": 4,
        "uiText": "Parcel Delivery Cancelled"
    }
}


const parcels = [
    {
        "destination": "Ojota, Lagos",
        "pickUpLocation": "SendIT Pickup Station, Ojota",
        "price": "N500",
        "status": statuses.InTransit
    },
    {
        "destination": "Ikeja, Lagos",
        "pickUpLocation": "SendIT Pickup Station, Ikeja",
        "price": "N700",
        "status": statuses.Delivered
    },
    {
        "destination": "Maitama, Abuja",
        "pickUpLocation": "SendIT Pickup Station, Wuse",
        "price": "N5000",
        "status": statuses.Cancelled
    }
] 



const parcelId = parseInt(window.location.search.replace("?parcelId=", ""), 10) || -1;
const destinationNode = document.querySelector("input[name='destination']")
let pickUpLocationNode = undefined;
let priceNode = undefined;
let statusNode = undefined;
let cancelButton = undefined;
const populateField = _ => {
    if (parcelId > -1){
        const parcel = parcels[parcelId - 1];
        if (parcel === null || parcel === undefined) {
            // TODO (oneeyedsunday)
            // fix for serving
            window.history.length > 2 ? window.history.back() : window.location.href = "http://localhost:5500/UI/";
        }
        // TODO (oneeyedsunday)
        // Refactor into a function
        destinationNode.setAttribute('value', parcel.destination);
        pickUpLocationNode ? pickUpLocationNode.setAttribute('value', parcel.pickUpLocation) : undefined;
        priceNode ? priceNode.setAttribute('value', parcel.price) : undefined;
        statusNode ? statusNode.setAttribute('value', parcel.status.uiText) : undefined;
        parcel.status.code === statuses.Delivered.code  || statuses.Cancelled.code ? cancelButton.setAttribute('disabled', true) : '';
    } else {
        window.history.back()
    } 
}

// TODO (oneeyedsunday)
// deal with this check
if ((window.location.pathname === "/UI/parcels/edit.html") || (window.location.pathname ===  "/UI/parcels/details.html")) {
    if(window.location.pathname === "/UI/parcels/details.html"){
        pickUpLocationNode = document.querySelector("input[name='pickup-location']")
        priceNode = document.querySelector("input[name='price']")
        statusNode = document.querySelector("input[name='status']")
        cancelButton = document.querySelector("button.danger")
    }
    document.addEventListener('DOMContentLoaded', populateField);
}