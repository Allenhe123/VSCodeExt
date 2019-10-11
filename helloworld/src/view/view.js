
const vscode = acquireVsCodeApi();
const callbacks = {};


// vscode.window.addEventListener('message', event => {
//     const message = event.data;
//     switch (message.cmd) 
//     {
//         case 'vscodeCallback':
//             console.log(message.data);
//             (callbacks[message.cbid] || function () { })(message.data);
//             delete callbacks[message.cbid];
//             break;
//         default: break;
//     }
// });


//   调用vscode原生api
//   @param data 可以是类似 {cmd: 'xxx', param1: 'xxx'}，也可以直接是 cmd 字符串
//   @param cb 可选的回调函数

function callVscode(data, cb) 
{
    // if (typeof data === 'string') 
    // {
    //     // data = { cmd: data };
    // }
    if (cb)
    {
        const cbid = Date.now() + '' + Math.round(Math.random() * 100000);
        callbacks[cbid] = cb;
        data.cbid = cbid;
    }
    vscode.postMessage(data);
}

function update_fm() {
    var path = document.getElementById("fm-script").value;
    callVscode( {cmd: 'update_fm', param: path}, () => { this.alert('update fm successfully！');} );
}

function flash_img() {
    var path = document.getElementById("script-id").value;
    let password = document.getElementById("paswd-id").value;
    callVscode( {cmd: 'flash_img', param: path, paswd: password}, () => { this.alert('flash images successfully！');} );
}

function adb_push() {
    let src = document.getElementById("src-id").value;
    let dst = document.getElementById("dst-id").value;
    callVscode( {cmd: 'adb_push', source: src, dest: dst}, () => { this.alert('push successfully！');} );
}

function adb_pull() {
    let src = document.getElementById("pull-src-id").value;
    let dst = document.getElementById("pull-dst-id").value;
    callVscode( {cmd: 'adb_pull', source: src, dest: dst}, () => { this.alert('pull successfully！');} );
}


function start_board()
{
    // exec("adb fastboot continue");
}