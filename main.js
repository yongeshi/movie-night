function ajax(endpoint, func) {
	var url;
	var searchTerm;
	if(endpoint == "now_playing") {
		url = "https://api.themoviedb.org/3/movie/now_playing?api_key=4327aaf1f353f8133e49eea01e474f4e&language=en-US&page=1";
	}
	else if(endpoint == "search") {
		searchTerm = document.querySelector("#search-id").value.trim();
		url = "https://api.themoviedb.org/3/search/movie?api_key=4327aaf1f353f8133e49eea01e474f4e&language=en-US&query=" + searchTerm + "&page=1&include_adult=false";
	}
	else {
		return;
	}
    
    let httpRequest = new XMLHttpRequest();
	httpRequest.open("GET", url);
	httpRequest.send();

	httpRequest.onreadystatechange = function() {
		if( httpRequest.readyState == 4 ) {
			if( httpRequest.status == 200 ) {
				func(httpRequest.responseText);
			}
			else {
				document.querySelector("#show-id").innerHTML = "Error";
			}
		}
	}
}

function displayResults(results) {
	let JSresponse = JSON.parse(results);
	console.log(JSresponse);


	// Clear out the previous search results before appending the new ones
	let body = document.querySelector(".movie-row");
	while(body.hasChildNodes()) {
		body.removeChild(body.lastChild);
	}

	//display showing # here ****************
	if(JSresponse.total_results == "0") {
		document.querySelector("#show-id").innerHTML = "No results";
	}
	else {
		document.querySelector("#show-id").innerHTML = "Showing " + JSresponse.results.length + " of " + JSresponse.total_results + " result(s):";
	}

	// Display all the results on the browser
	for(let i = 0; i < JSresponse.results.length; i++) {

		// <div class="four-column">
		// 	<img class="pic" src="https://images.squarespace-cdn.com/content/v1/535469cde4b02e672cf340ef/1598477452780-OKEFA55SZ2MPEDKP1TJJ/ke17ZwdGBToddI8pDm48kAAXX4P67ft3ytzdg616QI1Zw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIycs3X-ITtaKfjgRFtuvWV4slSMazoYQ-1_YAuDu5KJ4KMshLAGzx4R3EDFOm1kBS/Violet+-+crop.jpg?format=750w" alt="Taro Bun">
		// 	<div class="name">Taro Bun</div>
		// 	<p class="movie-name">hi</p>
		// 	<p class="movie-date">date</p>
		// </div>

		let movie = document.createElement("div");
		movie.classList.add("four-column");

		let img = document.createElement("img");
		img.classList.add("pic")
		if(JSresponse.results[i].poster_path == null) {
			img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQZoxTtQNJqmWF21q1b9kWRPmMdPph-qR7yqA&usqp=CAU";
		}
		else {
			img.src = "https://image.tmdb.org/t/p/w500" + JSresponse.results[i].poster_path;
			img.alt = "No picture";
		}

		let des = document.createElement("div");
		des.classList.add("name");
		des.innerHTML = "Rating: " + JSresponse.results[i].vote_average + "<br>Vote Count: " + JSresponse.results[i].vote_count + "<br>Description: ";
		if(JSresponse.results[i].overview.length > 200) {
			des.innerHTML += JSresponse.results[i].overview.substring(0,200) + "...";
		}
		else {
			des.innerHTML += JSresponse.results[i].overview;
		}
		des.style.fontSize = ".75em";

		let name = document.createElement("p");
		name.classList.add("movie-name");
		name.innerHTML = JSresponse.results[i].title;

		let date = document.createElement("p");
		date.classList.add("movie-date");
		date.innerHTML = JSresponse.results[i].release_date;

		movie.appendChild(img);
		movie.appendChild(des);
		movie.appendChild(name);
		movie.appendChild(date);
		document.querySelector(".movie-row").appendChild(movie);
	}
}

document.querySelector("#search-form").onsubmit = function(event) {
    event.preventDefault();
	ajax("search", displayResults);
}

ajax("now_playing", displayResults);