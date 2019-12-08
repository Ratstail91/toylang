//spawn toy
var spawn = require('child_process').spawn;

function runToyCode(req, res) {
	let output = "";
	let killed = false;
	let finished = false;

	console.log('running code', JSON.stringify(req.body));
	var proc = spawn('mono', ['Toy/out/interpreter', 'run', req.body]);

	proc.stdout.setEncoding('utf8');
	proc.stdout.on('data', data => {
//	console.log('stdout:', data);
		output += data
			.toString()
			.split(/\r?\n/g)
			.join('\n')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			;
	});

	proc.stderr.setEncoding('utf8');
	proc.stderr.on('data', data => {
//	console.log('stderr:', data);
		output += data
			.toString()
			.split(/\r?\n/g)
			.join('\n')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			;
	});

	proc.on('close', code => {
//		console.log('close');
		if (killed) {
			res.end('process killed');
		} else {
			res.end(output);
		}
		finished = true;
	});

	setTimeout(() => {
		if (!finished) {
			console.log('killing');
			proc.kill('SIGINT');
			killed = true;
		}
	}, 3000);
}

//express
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(bodyParser.text( { type: 'text/plain', extended: true } ));

app.get('*', express.static(path.resolve('../public')));
app.post('/run', (req, res) => runToyCode(req, res));

app.listen(4100, () => console.log('toylang server listening on port 4100'));

