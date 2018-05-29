let btcs = new WebSocket("wss://ws.blockchain.info/inv");
let inUSD = false;
let conversion = -1;

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

let radioBTC = document.getElementById("BTC");
radioBTC.onclick = function() {
	inUSD = false;
}
let radioUSD = document.getElementById("USD");
radioUSD.onclick = function() {
	if (conversion !== -1) {
		inUSD = true;
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
	let elem = document.createElement("div");
	const size = Math.log(amt+1.8) * 40;
	let val = (inUSD)? (`$${amt*conversion}`) : `${amt}BTC`;
	const node = document.createTextNode(val);
	elem.appendChild(node);

	const red = Math.max(0, 255-(Math.floor(Math.log(amt+1.8))*96));
	const blue = Math.min(255, (Math.floor(Math.log(amt+1.8))*96));
	const green = 0;
	let top = (Math.random() * 80) + 15;
	elem.style.fontSize = size + "px";
	elem.style.color = `rgb(${red}, ${green}, ${blue}`;
	elem.style.display = "inline-block";
	elem.style.position = "absolute";
	elem.style.top = `${top}%`;
	elem.style.left = "-100%";
	elem.style.width = "auto";

	let ticker = document.getElementById("ticker");
	ticker.appendChild(elem);

	travel(elem);
}

function travel(elem) {
	let per = -100;
	let freq = (Math.random() * 1.5);
	let id = setInterval(frame, 20);
	let ticker = document.getElementById("ticker");
	function frame() {
		if (per >= 200) {
			clearInterval(id);
			ticker.removeChild(elem);
		} else {
			per += freq;
			elem.style.left = `${per}%`;
		}
	}
}
