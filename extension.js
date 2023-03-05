const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let [currentPlaygroundPanel, currentDocumentationPanel] = [
		vscode.WebviewPanel | undefined,
		vscode.WebviewPanel | undefined,
	];
	
	const version = '0.28.0';
	const webviewData = {
		version,
	};

	let playgroundDisposable = vscode.commands.registerCommand('ramdajs-playground.openPlayground', function () {
		const columnToShowIn = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (currentPlaygroundPanel) {
			// If we already have a panel, show it in the target column
			currentPlaygroundPanel.reveal(columnToShowIn);
		} else {
			currentPlaygroundPanel = vscode.window.createWebviewPanel(
				'Ramda JS REPL',
				`Ramda JS REPL (${version})`,
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
				}
			);

			
			currentPlaygroundPanel.webview.html = getPlaygroundWebviewContent(webviewData);

			// Reset when the current panel is closed
			currentPlaygroundPanel.onDidDispose(
				() => {
					currentPlaygroundPanel = undefined;
				},
				null,
				context.subscriptions
			);
		}
	});

	let documentationDisposable = vscode.commands.registerCommand('ramdajs-playground.openDocumentation', function () {
		const columnToShowIn = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (currentDocumentationPanel) {
			// If we already have a panel, show it in the target column
			currentDocumentationPanel.reveal(columnToShowIn);
		} else {
			currentDocumentationPanel = vscode.window.createWebviewPanel(
				'Ramda JS Documentation',
				`Ramda JS Documentation (${version})`,
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true,
				}
			);

			currentDocumentationPanel.webview.html = getDocumentationWebviewContent(webviewData);

			// Reset when the current panel is closed
			currentDocumentationPanel.onDidDispose(
				() => {
					currentDocumentationPanel = undefined;
				},
				null,
				context.subscriptions
			);
		}
	});

	context.subscriptions.push(playgroundDisposable, documentationDisposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

function getPlaygroundWebviewContent({ version }) {
	return `
	<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Ramda JS REPL (${version})</title>
	</head>
	<body>
	  <iframe 
	  	id="my-iframe" 
		src="https://ramdajs.com/repl/?v=${version}#?%0A%0A%0A%0A%0A%0A%0A%0A%0A%0A%0A%0A%0A" 
		frameborder="0"
		style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;">
	  </iframe>

	  <style>
		@media (max-width: 767px) {
			iframe header .navbar-left {
				position: unset;
				width: auto;
			}
		}
	  </style>
	</body>
	</html>
  `;
}


function getDocumentationWebviewContent({ version }) {
	return `
	<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Ramda JS Documentation (${version})</title>
	</head>
	<body>
	  <iframe 
	  	id="my-iframe" 
		src="https://ramdajs.com/docs/#" 
		frameborder="0"
		style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%;">
	  </iframe>

	  <style>
		@media (max-width: 767px) {
			iframe header .navbar-left {
				position: unset;
				width: auto;
			}
		}
	  </style>
	</body>
	</html>
  `;
}

module.exports = {
	activate,
	deactivate
}
