const userId = localStorage.getItem('ispoa-sendit:userId')
const token = localStorage.getItem('ispoa-sendit:token')
const form = document.querySelector('form');

const uiTextForStatusCode = code => {
  switch (code) {
    case 0:
      return 'Awaiting Processing'

    case 1:
      return 'In Transit'

    case 2:
      return 'Delivered'
    
    case 4:
      return 'Cancelled'
    default:
      break;
  }
}

const createButtons = (id, cancellable = true) => {
  const detailsLink = createElement('a', {
    href: `details.html?parcelId=${id}`
  })

  
  const editLink = createElement('a', {
    href: `edit.html?parcelId=${id}`
  })

  detailsLink.append('Details');
  editLink.append('Edit');
  const detailsBtn = createElement('button', {
    class: 'button',
  })

  const editBtn = createElement('button', {
    class: 'button'
  })
  detailsBtn.appendChild(detailsLink);
  editBtn.appendChild(editLink)
  let cancelBtn = null;
  if (cancellable) {
    cancelBtn = createElement('button', { class: 'button danger' })
    cancelBtn.append('Cancel')
  }
  return {
    details: detailsBtn,
    edit: editBtn,
    cancel: cancelBtn
  };
}

const storeParcelsInCache = parcels => {
  localStorage.setItem('ispoa-sendit:yourparcels', JSON.stringify(parcels))
}

const populateParcels = parcels => {
  const fragment = document.createDocumentFragment();
  // create tr for each parcel
  for (let index = 0; index < parcels.length; index++) {
    let trNode = createElement('tr');
    const countNode = createElement('td');
    const dateNode = createElement('td');
    dateNode.append('October 31st');
    countNode.append(index + 1);
    trNode.append(countNode)
    trNode.append(dateNode);

    const destinationNode = createElement('td');
    destinationNode.append(parcels[index]['destination']);
    trNode.append(destinationNode);

    const statusNode = createElement('td');
    statusNode.append(uiTextForStatusCode(parcels[index]['status']));
    trNode.append(statusNode)

    const detailsTd = createElement('td');
    const btn = createButtons(parcels[index]['id'], parcels[index]['status'] !== 4)
    if(btn.details) detailsTd.append(btn.details)
    trNode.append(detailsTd);

    const editTd = createElement('td');
    if(btn.edit) editTd.append(btn.edit)
    trNode.append(editTd);

    const cancelTd = createElement('td');
    if (btn.cancel) cancelTd.append(btn.cancel);
    trNode.append(cancelTd)

    fragment.append(trNode);
  }
  console.log(fragment)
  const tableBody = document.querySelector('tbody');
  const children = tableBody.children;
  console.log(children)
  console.log(tableBody.childElementCount)
  for (let index = tableBody.childElementCount; 0 < index; index--) {
    tableBody.removeChild(children[index - 1]);
  }

  tableBody.append(fragment)
  // craete td for each field
}

const getParcelDetails = parcelId => {
  let allMyParcels = localStorage.getItem('ispoa-sendit:yourparcels');
  allMyParcels = JSON.parse(allMyParcels);
  return allMyParcels.filter(parcels => parcels.id === parcelId)[0];
}


if (form) {
  form.onsubmit = evt => {
  evt.preventDefault();
  console.log(evt.target.action);
  if(evt.target.action.indexOf('/api/v1/parcels') > -1) {
    const destination = document.querySelector('input[name="destination"]').value;
    const pickUpLocation = document.querySelector('input[name="pickuplocation"]').value;
    const stringified = JSON.stringify({
      parcel: {
      destination,
      pickUpLocation
    }
    })
    console.log(stringified);
    // return;
    Client.post(stringified, `parcels?token=${token}`)
      .then(response => response.json())
      .then(jsoned => {
        console.log(jsoned);
      })
      .catch(err => console.error(err))
  }
}
}

if (window.location.href.indexOf('parcels/details.html?parcelId=') > -1) {
  console.log(getParcelDetails(window.location.search.replace("?parcelId=", "")));
  // fill out form with values
}


Client.get(`users/${userId}/parcels?token=${token}`)
  .then(response => response.json())
  .then((jsonedResponse) => {
    console.log(jsonedResponse);
    if (form.action === '/api/v1/parcels') populateParcels(jsonedResponse);
    storeParcelsInCache(jsonedResponse);
  })
const fields = ['destination', 'status', 'id'];

