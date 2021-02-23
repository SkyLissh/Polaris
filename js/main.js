// Toggle Theme
const toggleButton = document.getElementById("toggle-theme");
const iconTheme = document.getElementById("icon-theme")
let lightTheme = localStorage.getItem("lightTheme");

function disableLight() {
	document.body.classList.remove("light-theme");
	localStorage.setItem("lightTheme", null);
	toggleButton.innerHTML = `<i id="theme__icon" data-feather="sun"></i>`
	feather.replace()
}

function enableLight() {
	document.body.classList.add("light-theme");
	localStorage.setItem("lightTheme", "enabled");
	toggleButton.innerHTML = `<i id="theme__icon" data-feather="moon"></i>`
	feather.replace()
}

lightTheme === "enabled" ? enableLight() : disableLight();

toggleButton.addEventListener("click", () => {
		lightTheme = localStorage.getItem("lightTheme");
		lightTheme === "enabled" ? disableLight() : enableLight();
	}
);

// Weather widget
const weather = {};

const weatherIcon = document.getElementById("weather-icon");
const weatherTemp = document.getElementById("weather-temp");
const weatherDesc = document.getElementById("weather-desc");

const apiKey = "5197658edc0a8d61d04c630f4ad2831a";
const cityName = "oaxaca";

async function getWeather() {

	const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`);

	const data = await res.json();
	const temperature = Math.round(data.main.temp);
	const iconId = data.weather[0].icon;

	weatherIcon.setAttribute("src", `assets/icons/${iconId}.png`);
	weatherTemp.textContent = `${temperature}ºC`;
	weatherDesc.textContent = data.weather[0].description;
	
	setTimeout(getWeather, 1000*60*30); //Get the weather every 30 minutes
}

getWeather();

// Time & Date
function showDate() {
	let d = new Date();
	let mmmm = d.toLocaleString("en-us", { month: "long" });
	let dddd = d.toLocaleString("en-us", { weekday: "long" });
	let dd = d.getDate();

	let hh = ("0" + d.getHours()).slice(-2);
	let min = ("0" + d.getMinutes()).slice(-2);

	document.getElementById("time").innerText = `${hh}:${min}`;
	document.getElementById("date").innerText = `${dddd}, ${mmmm} ${dd}`;

	setTimeout(showDate, 1000);
}

showDate();

//Greeting
function showGreeting() {
	const hour = new Date().getHours();

	const name = "Alisson";
	const greet = document.getElementById("greeting");

	if (hour >= 23 || hour < 5) greet.innerText = `You should sleep a bit, ${name}`;
	else if (hour >= 6 && hour < 12) greet.innerText = `Good Morning, ${name}`;
	else if (hour >= 12 && hour < 19) greet.innerText = `Good Afternoon, ${name}`;
	else greet.innerText = `Good Evening, ${name}`;

	setTimeout(showGreeting, 1000*60);
}

showGreeting();

// Searcher
const searcher = document.getElementById("searcher");
// Show suggestion popup
function suggestionPopup(searcher) {
	const popup = document.getElementById("search__popup");
	if (searcher.value) popup.classList.remove("popup__hide");
	else popup.classList.add("popup__hide");
}


// Searcher suggestions
let index = -1;
searcher.addEventListener("keyup", (e) => {
	if (e.target === searcher.search__input) {
		const popup = document.getElementById("search__popup");
		let termList;

		if (e.key != "ArrowDown" && e.key != "ArrowUp") {
			index = -1;
			suggestionPopup(e.target);
			getSuggestions(e.target.value);
		}

		if (popup.children[0] != undefined) termList = popup.children[0].children; 

		if (index < -1 || index > 5) index = -1;
		if (e.key === "ArrowDown" || e.key === "ArrowUp") showPopup(termList, e)

	}
});

function showPopup(termList, event) {

	if (event.key === "ArrowDown" && termList) {
		if (index === 4) index = -1;
		index++;

		if (index > 0) termList[index-1].classList.remove("selected");
		if (index === 0) termList[4].classList.remove("selected");

		termList[index].classList.add("selected");

	} else if (event.key === "ArrowUp" && termList) {
		if (index === 0) index = 5;
		if (index === -1) index = 4;

		index--;

		if (index < 4) termList[index+1].classList.remove("selected");
		if (index == 4) termList[0].classList.remove("selected");

		termList[index].classList.add("selected");

	}

	if (index > -1 && index < 5) {
		let text = termList[index].children[0].textContent;
		event.target.value = text;
	}
}

searcher.addEventListener("blur", () => {
	document.getElementById("search__popup").classList.add("popup__hide");
}, true)

async function getSuggestions(term) {
	const searchTerm = term.toLowerCase();
	let url = `http://suggestqueries.google.com/complete/search?client=firefox&q=${searchTerm.replaceAll(" ", "+")}&hl=en&callback=showSuggestions` // Google suggestions

	addScript(url);
}

function showSuggestions(data) {
	const suggestions = data[1].slice(0, 5);
	const suggList = document.getElementById("search__popup");
	suggList.innerHTML = `
		<ul class="search__suggestion-list">
			${suggestions.map((sugg) => {
				return `
				<li class="search__suggestion">
					<a 
						class="search__suggestion-link" 
						href="https://www.duckduckgo.com/?q=${sugg.replaceAll(" ", "+")}">${sugg}</a>
				</li>
				`;
			}).join('')}
		</ul>
	`
}

function addScript(url) {
	const s = document.getElementById("google-request");

	if (s) s.remove();

	const req = document.createElement("script");
	req.id = "google-request";
	req.src = url;
	document.body.appendChild(req);
}

searcher.addEventListener("submit", (e) => {
	e.preventDefault();
	window.location.href =`https://duckduckgo.com/?q=${e.target.search__input.value}`;
})

