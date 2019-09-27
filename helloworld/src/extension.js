// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Uri = require('url');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * 插件被激活时触发，所有代码总入口
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// // Use the console to output diagnostic information (console.log) and errors (console.error)
	// // This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "helloworld" is now active!');

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with  registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World! Hello VS Code!');
	// });

	// let getpath = vscode.commands.registerCommand('extension.getCurrentFilePath', function(uri) {
	// 	vscode.window.showInformationMessage(`current path is: ${uri? uri.path : 'empty'}`);
	// });

	console.log('恭喜，您的扩展“vscode-plugin-demo”已被激活！');
    // console.log(vscode);
	require('./helloworld')(context);            // hello world
	require('./test-command-param')(context);    // 测试命令参数
	require('./test-menu-when')(context);        // 测试菜单when命令
	require('./webview')(context); // Webview

	// context.subscriptions.push(disposable);
	// context.subscriptions.push(getpath);

	// vscode.commands.getCommands().then(allCommands => {
	// 	vscode.window.showInformationMessage('allCommands!');
	// 	console.log('所有命令：', allCommands);
	// });

	// let uri = Uri.file('/home/allen');
	// 	vscode.commands.executeCommand('vscode.openFolder', uri).then(success => {
	// 	console.log(success);
	// });


}
exports.activate = activate;

// this method is called when your extension is deactivated
//插件被释放时触发
function deactivate() {
	console.log('your vscode-plugin has been released！')
}

module.exports = {
	activate,
	deactivate
}
