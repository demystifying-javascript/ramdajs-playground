const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let currentPanel = vscode.WebviewPanel | undefined;

	let disposable = vscode.commands.registerCommand('ramdajs-playground.openPlayground', function () {
		const columnToShowIn = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (currentPanel) {
			// If we already have a panel, show it in the target column
			currentPanel.reveal(columnToShowIn);
		} else {
			const version = '0.28.0';
			currentPanel = vscode.window.createWebviewPanel(
				'Ramda JS REPL',
				`Ramda JS REPL (${version})`,
				vscode.ViewColumn.One,
				{
					enableScripts: true,
				}
			);

			const data = {
				version,
			};
			currentPanel.webview.html = getWebviewContent(data);

			// Reset when the current panel is closed
			currentPanel.onDidDispose(
				() => {
					currentPanel = undefined;
				},
				null,
				context.subscriptions
			);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

function getWebviewContent({ version }) {
	return `
	<!DOCTYPE html>
	<html>
	<head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Website (${version})</title>
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

module.exports = {
	activate,
	deactivate
}
