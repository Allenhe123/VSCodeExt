const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const util = require('./util');

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
function getWebViewContent(context, templatePath) {
    const resourcePath = util.getExtensionFileAbsolutePath(context, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
    });
    return html;
}

/**
 * 执行回调函数
 * @param {*} panel 
 * @param {*} message 
 * @param {*} resp 
 */
function invokeCallback(panel, message, resp) 
{
    console.log('回调消息：', resp);
    // 错误码在400-600之间的，默认弹出错误提示
    if (typeof resp == 'object' && resp.code && resp.code >= 400 && resp.code < 600) 
    {
        util.showError(resp.message || '发生未知错误！');
    }
    // 插件给Webview发送消息
    panel.webview.postMessage({cmd: 'vscodeCallback', cbid: message.cbid, data: resp});
}

/**
 * 存放所有消息回调函数，根据 message.cmd 来决定调用哪个方法
 * ES6中，当对象中的key：value键值对，如果value是个变量/函数，此时省略key，key的值就是变量名/函数名。
 */
const messageHandler = {
    // 弹出提示
    alert(global, message) {
        util.showInfo(message.info);
    },
    // 显示错误提示
    error(global, message) {
        util.showError(message.info);
    },
    // 获取工程名
    getProjectName(global, message) {
        invokeCallback(global.panel, message, util.getProjectName(global.projectPath));
    },
    openFileInFinder(global, message) {
        util.openFileInFinder(`${global.projectPath}/${message.path}`);
        // 这里的回调其实是假的，并没有真正判断是否成功
        invokeCallback(global.panel, message, {code: 0, text: '成功'});
    },

    update_fm(global, message) {
        var child_process = require('child_process');
        var spawnObj = child_process.spawn('python3', [message.param]);

        spawnObj.stdout.on('data', function(chunk) {
            vscode.window.showInformationMessage(chunk.toString());
        });

        spawnObj.stderr.on('data', (data) => {
            vscode.window.showInformationMessage(data.toString());
        });

        spawnObj.on('close', function(code) {
            vscode.window.showInformationMessage(code.toString());
        });

        spawnObj.on('exit', (code) => {
            vscode.window.showInformationMessage(code.toString());
        });
    },

    flash_img(global, message) {
        const fs = require('fs');
        var child_process = require('child_process');
        // var spawnObj = child_process.spawn('python3', ['/home/allen/BST-OS-img/v0.2.6/images/test.py', 'allen']);
        vscode.window.showInformationMessage(message.param);
        var spawnObj = child_process.spawn('python3', [message.param, message.paswd]);

        spawnObj.stdout.on('data', function(chunk) {
            vscode.window.showInformationMessage(chunk.toString());
            console.log(chunk.toString());
        });

        spawnObj.stderr.on('data', (data) => {
            vscode.window.showErrorMessage(data.toString());
            console.log(data);
        });

        spawnObj.on('close', function(code) {
            console.log('close code : ' + code);
            vscode.window.showInformationMessage(code.toString());
        });

        spawnObj.on('exit', (code) => {
            console.log('exit code : ' + code);
            vscode.window.showInformationMessage(code.toString());
        });
    },

    adb_push(global, message) {
        // let child_process = require('child_process');
        // let cmd = 'adb push ';
        // cmd += message.source;
        // cmd += ' ';
        // cmd += message.dest;
        // vscode.window.showInformationMessage(cmd);
        // child_process.exec(cmd, function (err, stdout, srderr) {
        //     if(err)
        //     {
        //         vscode.window.showErrorMessage(srderr);
        //     }
        //     else 
        //     {
        //         vscode.window.showInformationMessage(stdout);
        //     }
        // });

        var child_process = require('child_process');
        var spawnObj = child_process.spawn('adb', ['push', message.source, message.dest]);

        spawnObj.stdout.on('data', function(chunk) {
            vscode.window.showInformationMessage(chunk.toString());
        });

        spawnObj.stderr.on('data', (data) => {
            vscode.window.showInformationMessage(data.toString());
        });

        spawnObj.on('close', function(code) {
            vscode.window.showInformationMessage(code.toString());
        });

        spawnObj.on('exit', (code) => {
            vscode.window.showInformationMessage(code.toString());
        });
    },

    adb_pull(global, message) {
        var child_process = require('child_process');
        var spawnObj = child_process.spawn('adb', ['pull', message.source, message.dest]);

        spawnObj.stdout.on('data', function(chunk) {
            vscode.window.showInformationMessage(chunk.toString());
        });

        spawnObj.stderr.on('data', (data) => {
            vscode.window.showInformationMessage(data.toString());
        });

        spawnObj.on('close', function(code) {
            vscode.window.showInformationMessage(code.toString());
        });

        spawnObj.on('exit', (code) => {
            vscode.window.showInformationMessage(code.toString());
        });
    },

    openUrlInBrowser(global, message) {
        util.openUrlInBrowser(message.url);
        invokeCallback(global.panel, message, {code: 0, text: '成功'});
    }
};

module.exports = function(context) 
{
    // 注册命令，可以给命令配置快捷键或者右键菜单
    // 回调函数参数uri：当通过资源管理器右键执行命令时会自动把所选资源URI带过来，当通过编辑器中菜单执行命令时，会将当前打开的文档URI传过来
    context.subscriptions.push(vscode.commands.registerCommand('extension.openWebview', function (uri) 
    {
        // 工程目录一定要提前获取，因为创建了webview之后activeTextEditor会不准确
        const projectPath = util.getProjectPath(uri);
        console.log(projectPath);
        vscode.window.showInformationMessage(projectPath);
        if (!projectPath) return;

        const panel = vscode.window.createWebviewPanel(
            'testWebview', // viewType
            "WebView演示", // 视图标题
            vscode.ViewColumn.One, // 显示在编辑器的哪个部位
            {
                enableScripts: true, // 启用JS，默认禁用
                retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
            }
        );

        let global = { projectPath, panel};
        panel.webview.html = getWebViewContent(context, 'src/view/webview.html');

        panel.webview.onDidReceiveMessage(message => {
            // cmd表示要执行的方法名称
            if (messageHandler[message.cmd]) {
                messageHandler[message.cmd](global, message);
            } else {
                util.showError(`未找到名为 ${message.cmd} 回调方法!`);
            }
        }, undefined, context.subscriptions);

        panel.onDidDispose(message => {
            console.log("receive dispose msg");
            panel.dispose();
        });

    }));
};
