function run() {
	let inputNode = document.getElementById("input");
	let outputNode = document.getElementById("output");

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				outputNode.innerHTML = DOMPurify.sanitize(parseDOM(xhr.responseText));
			} else {
				console.log(xhr.responseText);
			}
		}
	}

	xhr.open('POST', '/run', true);
	xhr.setRequestHeader('Content-Type', 'text/plain');
	xhr.send(inputNode.value);

	return false;
}

function parseDOM(str) {
	return str.replace(/\n/g, '<br>');
}