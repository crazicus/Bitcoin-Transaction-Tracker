let btcs = new WebSocket("wss://ws.blockchain.info/inv");
let radioBTC = document.getElementById("BTC");
let radioUSD = document.getElementById("USD");
let inUSD = false;
let conversion = -1;
let count = 1;

let getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      let status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

getJSON("https://blockchain.info/ticker",
function(err, data) {
  if (err !== null) {
    console.log('Something went wrong: ' + err);
  } else {
    conversion = data.USD.last;
  }
});

radioBTC.onclick = function() {
	if (inUSD) {
		inUSD = false;
		radioBTC.style.backgroundColor = "#218838";
		radioBTC.style.borderColor = "#1e7e34";
		radioUSD.style.backgroundColor = "#28a745";
		radioUSD.style.borderColor = "#28a745";
	}
}
radioUSD.onclick = function() {
	if (!inUSD) {
		inUSD = true;
		radioUSD.style.backgroundColor = "#218838";
		radioUSD.style.borderColor = "#1e7e34";
		radioBTC.style.backgroundColor = "#28a745";
		radioBTC.style.borderColor = "#28a745";
	}
}

btcs.onopen = function() {
	btcs.send(JSON.stringify({"op":"unconfirmed_sub"}));
}

btcs.onmessage = function(msg) {
	let ticker = document.getElementById("ticker");
	const response = JSON.parse(msg.data);
	console.log(response);

	let amt = 0;
	const outs = response.x.out;

	for (let i = 0; i < outs.length; i++) {
		amt += outs[i].value;
	}

	amt = amt / 10e8;
	create(amt);
}

function create(amt) {
	count++;
	let elem = document.createElement("p");
	const size = Math.log(amt+1.8) * 40;
	let val = (inUSD)? (`$${(amt*conversion).toFixed(2)}`) : `${amt}BTC`;
	const node = document.createTextNode(val);
	elem.appendChild(node);

	const red = Math.floor(Math.random() * 208);
	const blue = Math.floor(Math.random() * 208);
	const green = Math.floor(Math.random() * 208);
	let top = (Math.random() * 75) + 15;
	elem.style.fontSize = size + "px";
	elem.style.color = `rgb(${red}, ${green}, ${blue}`;
	elem.style.display = "inline-block";
	elem.style.position = "absolute";
	elem.style.top = `${top}%`;
	elem.style.right = `${window.innerWidth+10}px`;
	elem.id = count;

	let ticker = document.getElementById("ticker");
	ticker.appendChild(elem);

	travel(elem);
}

function travel(elem) {
	const w = window.innerWidth + 10;
	console.log(w);
	let per = w + 10;
	const freq = (Math.random() * 5)+3;
	let id = setInterval(frame, 20);
	let ticker = document.getElementById("ticker");
	function frame() {
		if (per <= -1.25*w) {	
			clearInterval(id);
			ticker.removeChild(elem);
		} else {
			per -= freq;
			elem.style.right = `${per}px`;
		}
	}
}
