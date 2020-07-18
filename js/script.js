//select coronavirus image for animation
let covidImg = $('#covid');

$(document).ready(function () {
	$('#covid').addClass('rotate');
});

var stateRepository = (function () {
	// Array for state pulled from API
	var stateList = [];
	console.log(stateList);

	//List of states and IDs from path IDs
	let stateDiv = $('path');

	var apiUrl = 'https://covidtracking.com/api/states';

	function add(state) {
		stateList.push(state);
	}

	function getAll() {
		return stateList;
	}

	function addListItem(state) {
		var stateListButtonsGroup = $('.list-group');
		var listItem = $(
			'<button type="button" class="btn btn-outline-dark list-group-item" data-target="#exampleModal" data-toggle="modal"></button>'
		);
		listItem.text(state.state);
		stateListButtonsGroup.append(listItem);
		listItem.on('click', function () {
			showDetails(state);
		});
	}

	function showDetails(state) {
		loadDetails(state).then(function () {
			showModal(state);
		});
	}

	//JSON API Fetches state data

	function loadList() {
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				console.log(json);
				json.forEach(function (state) {
					var state = {
						state: state.state,
						cases: state.positive,
					};
					add(state);
				});
			});
	}

	function loadDetails(state) {
		var url = state.cases;
		return $.ajax(url)
			.then(function (details) {
				// Now we add the details to the item
				state.cases = details.positive;
			})
			.catch(function (e) {});
	}

	function showModal(state) {
		var modalBody = $('.modal-body');
		var modalTitle = $('.modal-title');
		modalBody.empty();
		modalTitle.empty();

        var stateName = $('<h5></h5>').text('State: ' + state.state);
        
		modalTitle.append(stateName);

		var stateCases = $('<p></p>').text(
			'Positive Cases: ' + state.cases.toLocaleString()
		);
		modalBody.append(stateCases);
	}

	return {
		add: add,
		getAll: getAll,
		loadList: loadList,
		showModal: showModal,
		showDetails: showDetails,
		addListItem: addListItem,
	};
})();

stateRepository.loadList().then(function () {
	stateRepository.getAll().forEach(function (state) {
		stateRepository.addListItem(state);
	});
});
