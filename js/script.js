
//select coronavirus image for animation
let covidImg = $('#covid');

$( document ).ready(function() {
    $('#covid').addClass('rotate');
});


var stateRepository = (function() {

// Array for state pulled from API    
var stateList =[];


//List of states and IDs from path IDs
let stateDiv = $('path');



var apiUrl = 'https://covidtracking.com/api/states';

function add(state){
    stateList.push(state);
}

function getAll(){
    return stateList;
}

$(stateDiv).hover(function(){
    console.log(stateDiv);
   })




function showDetails(item) {
    loadDetails(item).then(function () {
          
        for(let i =0;i<stateDiv.length;i++){
         if(item.name ===$(stateDiv[i]).attr('id')){
             $(stateDiv[i]).css("fill","red");
         };
        
        };

       
        
        function showModal() {
            var modalContainer = document.querySelector('#modal-container');
            modalContainer.classList.add('is-visible');

        }

        showModal();

        function showModal(title, text) {
            var modalContainer = document.querySelector('#modal-container');

            // Clear all existing modal content
            modalContainer.innerHTML = '';

            var modal = document.createElement('div');
            modal.classList.add('modal');

            // Add the new modal content
            var closeButtonElement = document.createElement('button');
            closeButtonElement.classList.add('modal-close');
            closeButtonElement.innerText = 'Close';

            var titleElement = document.createElement('h1');
            titleElement.innerText = item.name;
            console.log(titleElement);

            

            var covidCases = document.createElement('p');
            covidCases.innerText = "Cases: " + item.detail;

            modal.appendChild(closeButtonElement);
            modal.appendChild(titleElement);
            modal.appendChild(covidCases);
            modalContainer.appendChild(modal);

            modalContainer.classList.add('is-visible');

            function hideModal() {
                modalContainer.classList.remove('is-visible');

            }

            closeButtonElement.addEventListener('click', hideModal)
        

            modalContainer.addEventListener('click', (e) => {
                // Since this is also triggered when clicking INSIDE the modal
                // We only want to close if the user clicks directly on the overlay
                var target = e.target;
                if (target === modalContainer) {
                  hideModal();
                }
              });
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
                  hideModal();  
                }
              });
        }

        function hideModal() {
            modalContainer.classList.remove('is-visible');

          }

        
    });
}











function addListItem(state) {
    let stateList = document.querySelector('.state-list');
    var listItem = document.createElement('li');
    var button = document.createElement('button');
    button.textContent = state.name;
    button.classList.add('styling');
    listItem.appendChild(button);
    stateList.appendChild(listItem);
    button.addEventListener('click', function () {
        showDetails(state);
    });
}

//JSON API Fetches state data

function loadList() {
    return fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            json.forEach(function (state) {
                var state = {
                    name: state.state,
                    detail: state.positive,
                };
                add(state);
            });
        })
        
}



function loadDetails(item) {
    
    return fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (details) {
            // Now we add the details to the item
            item.cases = details.cases;
            item.state = details.state;
        })
        .catch(function (e) {
            console.error(e);
        });
}

return {
    add: add,
    getAll: getAll,
    loadList: loadList,
    addListItem: addListItem,
};


}) ();


stateRepository.loadList().then(function() {
	stateRepository.getAll().forEach(function (state) {
		stateRepository.addListItem(state);
	});
});




