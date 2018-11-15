const baseURL = window.location.host;
const prefixURL = (baseURL.indexOf("oneeyedsunday.github.io") > -1) ? baseURL + "/sendIT/UI/" : "/UI/";
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
        "status": statuses.InTransit,
        "presentLocation": "Ketu, Lagos"
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

const createElement = (element, options) => {
    const nElement = document.createElement(element);

    for (const attr in options) {
        if (options.hasOwnProperty(attr)) {
            nElement.setAttribute(attr, options[attr])
        }
    }

    return nElement;
}

const addAdminFields = formFields => {
    const formFieldNodes = []; 
    for (let i = 0; i < formFields.length; i++) {
        const formField = formFields[i];
        const wrappedDiv = createElement("div", {'class': 'form__field'})
        for (let i = 0; i < formField.length; i++) {
            const nodeData = formField[i]; 
            const node = createElement(nodeData.element, nodeData.attributeValueMap)    
            if (nodeData.innerText)  node.innerText = nodeData.innerText
            if (nodeData.children) {
                nodeData.children.forEach(childNode => {
                    const subNode = createElement(childNode.element, childNode.attributeValueMap)
                    if(childNode.innerText) subNode.innerText = childNode.innerText
                    node.append(subNode);
                });
            }
            wrappedDiv.appendChild(node)
        }
        formFieldNodes.push(wrappedDiv);
    }
    return formFieldNodes;
}

const adminFields = [
    [
        {
            "element": "label",
            "attributeValueMap": {
                "for": "pickup-location",
            },
            "innerText": "Pick up Location"
        },
        {
            "element": "input",
            "attributeValueMap": {
                "type": "text",
                "name": "pickup-location",
                "placeholder": "Pick up Location"
            }
        }
    ],
    [
        {
            "element": "label",
            "attributeValueMap": {
                "for": "present-location",
            },
            "innerText": "Present Location"
        },
        {
            "element": "input",
            "attributeValueMap": {
                "type": "text",
                "name": "present-location",
                "placeholder": "Present Location of Parcel"
            }
        }
    ],
    [
        {
            "element": "label",
            "attributeValueMap": {
                "for": "status",
            },
            "innerText": "Delivery Status"
        },
        {
            "element": "select",
            "children": [
                {
                    "element": "option",
                    "attributeValueMap": {
                        "value": statuses.Cancelled.code
                    },
                    "innerText": statuses.Cancelled.uiText
                },
                {
                    "element": "option",
                    "attributeValueMap": {
                        "value": statuses.Delivered.code
                    },
                    "innerText": statuses.Delivered.uiText
                },
                {
                    "element": "option",
                    "attributeValueMap": {
                        "value": statuses.InTransit.code
                    },
                    "innerText": statuses.InTransit.uiText
                }
            ]
        }
    ]
]

const getParcel = id => parcels[id - 1];
const hasQuery = term => window.location.search.indexOf(term) > -1;
const getUrl = _ => window.location.pathname; 

const parcelId = parseInt(window.location.search.replace("?parcelId=", ""), 10) || -1;
const parcel = getParcel(parcelId);
const destinationNode = document.querySelector("input[name='destination']")
let pickUpLocationNode = undefined;
let priceNode = undefined;
let statusNode = undefined;
let actionButtonNode = undefined;
let presentLocationNode = undefined;
const populateField = _ => {    
    const submitButtons = document.getElementsByTagName('button');
    [].forEach.call(submitButtons,function(e){e.addEventListener('click',(evt) => { evt.preventDefault(); },false)})
    if (parcelId > -1){
        if (parcel === null || parcel === undefined) {
            // TODO (oneeyedsunday)
            // fix for serving from all hosts
            window.history.length > 2 ? window.history.back() : window.location.href = prefixURL;
            return;
        }
        // TODO (oneeyedsunday)
        // Refactor into a function
        destinationNode.setAttribute('value', parcel.destination);
        pickUpLocationNode ? pickUpLocationNode.setAttribute('value', parcel.pickUpLocation) : undefined;
        priceNode ? priceNode.setAttribute('value', parcel.price) : undefined;
        statusNode ? statusNode.setAttribute('value', parcel.status.uiText) : undefined;
        if ( actionButtonNode &&   (parcel.status.code === statuses.Delivered.code)   || (parcel.status.code === statuses.Cancelled.code)) actionButtonNode.setAttribute('disabled', true);
        presentLocationNode ? presentLocationNode.setAttribute('value',  (parcel.status.code !== statuses.InTransit.code) ? parcel.destination : parcel.presentLocation) : '';
    } else {
        window.history.back()
    } 
}

// TODO (oneeyedsunday)
// deal with this check
if ((getUrl() === prefixURL + "parcels/edit.html") || (getUrl() ===  prefixURL + "parcels/details.html")) {
    if(window.location.pathname === prefixURL + "parcels/details.html" ||  hasQuery("&context=admin") ){
        pickUpLocationNode = document.querySelector("input[name='pickup-location']")
        priceNode = document.querySelector("input[name='price']")
        statusNode = document.querySelector("input[name='status']")
        actionButtonNode = document.querySelector("button#actionButton")
        presentLocationNode = document.querySelector("input[name='present-location'")
    }

    if(getUrl() === prefixURL + "parcels/edit.html" && hasQuery("&context=admin")){
        console.log("Load admin content");
        document.querySelector(".form__title.text-center").innerHTML = "Admin: Make Changes to Parcel Order Details"
    }

    if(getUrl() === prefixURL + "parcels/details.html" && hasQuery("&context=admin")){
        console.log("Load admin content");
        actionButtonNode.setAttribute('class', 'button primary-action');
        actionButtonNode.innerHTML = "";
        const newLink = createElement("a", {
            "href": `${prefixURL}parcels/edit.html?parcelId=${parcelId}&context=admin`
        })

        newLink.innerText = "Update Parcel Delivery Order";
        actionButtonNode.appendChild(newLink)
        document.querySelector(".form__title.text-center").innerHTML = "Admin: Parcel Delivery Order Details"
    }

    if(getUrl() === 'parcels/edit.html' && hasQuery('&context=admin')) {
        const actionButtonsNode = document.getElementById("actionButtons");
        const formNode = document.querySelector("form.form");
        const nodes = addAdminFields(adminFields)
        formNode.removeChild(actionButtonsNode);
        for(let i = 0; i < nodes.length; i++) {
            formNode.appendChild(nodes[i])
        }
        formNode.appendChild(actionButtonsNode);
        presentLocationNode = document.querySelector("input[name='present-location'")
        pickUpLocationNode = document.querySelector("input[name='pickup-location']")
        statusNode = document.querySelector("select");
        // select correct status
        for(let i = 0; i < statusNode.children.length; i++){
            if(statusNode.children[i].getAttribute('value') === getParcel(parcelId).status.code.toString()) {
                statusNode.children[i].setAttribute('selected', true)
            }
        }
    }
    document.addEventListener('DOMContentLoaded', populateField);
}

