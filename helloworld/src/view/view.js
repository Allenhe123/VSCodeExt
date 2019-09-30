
const testMode = false; // 为true时可以在浏览器打开不报错
// vscode webview 网页和普通网页的唯一区别：多了一个acquireVsCodeApi方法
const vscode = testMode ? {} : acquireVsCodeApi();
const callbacks = {};

/**
 * 调用vscode原生api
 * @param data 可以是类似 {cmd: 'xxx', param1: 'xxx'}，也可以直接是 cmd 字符串
 * @param cb 可选的回调函数
 */
function callVscode(data, cb) 
{
    if (typeof data === 'string') 
    {
        data = { cmd: data };
    }
    if (cb) 
    {
        // 时间戳加上5位随机数
        const cbid = Date.now() + '' + Math.round(Math.random() * 100000);
        callbacks[cbid] = cb;
        data.cbid = cbid;
    }
    vscode.postMessage(data);
}

vscode.window.addEventListener('message', event => {
    const message = event.data;
    switch (message.cmd) 
    {
        case 'vscodeCallback':
            console.log(message.data);
            (callbacks[message.cbid] || function () { })(message.data);
            delete callbacks[message.cbid];
            break;
        default: break;
    }
});

function update_fm()
{
    console.log(document.getElementById("newfm").value);
    console.log(document.getElementById("oldfm").value);

    callVscode( {cmd: 'update_fm', path: `package.json`}, () => { this.alert('update fm successfully！');} );

    // // var exec = require('child_process').exec;

    // var cmdStr = 'ls -l';
    // exec(cmdStr, function (err, stdout, srderr)
    // {
    //     if(err)
    //     {
    //         console.log(srderr);
    //     }
    //     else 
    //     {
    //         console.log(stdout);
    //     }
    // });

    // vscode.window.showInformationMessage('Hello World！你好，周杰伦！');

}


function start_board()
{
    // exec("adb fastboot continue");
}