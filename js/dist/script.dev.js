'use strict';

//select coronavirus image for animation
var covidImg = $('.covid');
$(document).ready(function () {
	$(covidImg).addClass('pulsing');
});

var stateRepository = (function () {
	// Array for state pulled from API
	var stateList = [];
	console.log(stateList); //List of states and IDs from path IDs

	var stateDiv = $('path'); //Map hover state

	var apiUrl =
		'https://cors-anywhere.herokuapp.com/api.covidtracking.com/v1/states/current.json';

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
	} //JSON API Fetches state data

	function loadList() {
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
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
		return $.ajax(apiUrl)
			.then(function (details) {
				// Now we add the details to the item
				console.log(details);
				state.cases = Object.values(details.positive);
			})
			['catch'](function (e) {
				console.log(e);
			});
	}

	var stateName;
	var covidInfoDiv;
	var stateTitle;
	var covidParagraph;
	$(stateDiv).mouseover(function () {
		stateName = this.id;
		this.style.strokeWidth = '2';
		this.style.stroke = 'red';
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.forEach(function (state) {
					if (stateName === state.state) {
						covidInfoDiv = document.querySelector('.covidInfoDiv');
						stateTitle = document.querySelector('.state-heading');
						stateTitle.textContent = state.state;
						covidParagraph = document.querySelector('.state-cases');
						covidParagraph.textContent =
							'Cases: ' + state.positive.toLocaleString();
					}
				});
			});
	});
	$(stateDiv).mouseout(function () {
		stateName = this.id;
		this.style.strokeWidth = '0.97063118000000004';
		this.style.stroke = 'black';
		stateTitle.textContent = ' ';
		covidParagraph.textContent = ' ';
	});

	function mapColor() {
		return fetch(apiUrl)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				json.forEach(function (state) {
					for (var i = 0; i < stateDiv.length; i++) {
						if (stateDiv[i].id === state.state && state.positive >= 400000) {
							stateDiv[i].style.fill = 'rgb(102,0,0)';
						} else if (
							stateDiv[i].id === state.state &&
							state.positive >= 300000
						) {
							stateDiv[i].style.fill = 'rgb(204,0,0)';
						} else if (
							stateDiv[i].id === state.state &&
							state.positive >= 100000
						) {
							stateDiv[i].style.fill = 'rgb(255,0,0)';
						} else if (
							stateDiv[i].id === state.state &&
							state.positive >= 50000
						) {
							stateDiv[i].style.fill = 'rgb(255,51,51)';
						} else if (
							stateDiv[i].id === state.state &&
							state.positive >= 30000
						) {
							stateDiv[i].style.fill = 'rgb(255,102,102)';
						} else if (
							stateDiv[i].id === state.state &&
							state.positive >= 10000
						) {
							stateDiv[i].style.fill = 'rgb(255,153,153)';
						} else if (
							stateDiv[i].id === state.state &&
							state.positive >= 5000
						) {
							stateDiv[i].style.fill = 'rgb(255,204,204)';
						} else if (
							stateDiv[i].id === state.state &&
							state.positive <= 4999
						) {
							stateDiv[i].style.fill = 'rgb(255,200,200)';
						}
					}
				});
			});
	}

	mapColor();

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
		mapColor: mapColor,
		addListItem: addListItem,
	};
})();

stateRepository.loadList().then(function () {
	stateRepository.getAll().forEach(function (state) {
		stateRepository.addListItem(state);
	});
});
