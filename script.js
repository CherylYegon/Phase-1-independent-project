document.addEventListener('DOMContentLoaded', () => {
    const iceCreamList = document.getElementById('icecream');
    const iceTitle = document.getElementById('ice-title');
    const availableIceCream = document.getElementById('available-icecream');
    const image = document.getElementById('image');
    const buyIceCreamButton = document.getElementById('buy-icecream');
  
    const iceCreamEndpoint = 'http://localhost:3000/icecream';
    let selectedIceCream = null;
  
    const displayIceCreamDetails = (iceCreamData) => {
      iceTitle.textContent = iceCreamData.title;
      availableIceCream.textContent = iceCreamData.icecream_left;
      image.src = iceCreamData.image;
      selectedIceCream = iceCreamData;
    };
  
    const fetchIceCreamData = () => {
      fetch(iceCreamEndpoint)
        .then(response => response.json())
        .then(iceCreams => {
          if (iceCreams.length > 0) {
            displayIceCreamDetails(iceCreams[0]);
            iceCreams.forEach(iceCreamData => {
              const li = document.createElement('li');
              li.id = `icecream-${iceCreamData.id}`;
              li.classList.add('icecream', 'item');
  
              const span = document.createElement('span');
              span.textContent = iceCreamData.title;
              li.appendChild(span);
  
              li.addEventListener('click', () => displayIceCreamDetails(iceCreamData));
  
              iceCreamList.appendChild(li);
            });
          }
        })
        .catch(error => console.error('Error:', error));
    };
  
    const clearIceCreamDetails = () => {
      iceTitle.textContent = '';
      availableIceCream.textContent = '';
      image.src = '';
    };
  
    buyIceCreamButton.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent page reload
      if (selectedIceCream) {
        const availableIceCreamCount = selectedIceCream.icecream_left;
        if (availableIceCreamCount > 0) {
          const confirmOrder = window.confirm('Confirm this Order');
          if (confirmOrder) {
            const updatedIceCreamLeft = availableIceCreamCount - 1;
            const currentIceCream = {
              ...selectedIceCream,
              icecream_left: updatedIceCreamLeft
            };
            displayIceCreamDetails(currentIceCream);
            updateIceCreamLeft(currentIceCream.id, updatedIceCreamLeft);
          }
        }
      }
    });
  
    const updateIceCreamLeft = (iceCreamId, iceCreamLeft) => {
      fetch(`${iceCreamEndpoint}/${iceCreamId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          icecream_left: iceCreamLeft
        })
      })
        .then(response => response.json())
        .then(iceCreamData => {
          displayIceCreamDetails(iceCreamData);
        })
        .catch(error => console.error('Error:', error));
    };
  
    fetchIceCreamData();
  });
  