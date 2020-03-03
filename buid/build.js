
var fs = require('fs');
var path = require('path');
var os = require("os");
//解析需要遍历的文件夹，我这以E盘根目录为例
var currentDir=process.cwd();
currentDir='D:\\project_code\\lmn-place';
var workdir=path.join(currentDir,'docs');
var tranverteDir=path.join(currentDir,'docs','求职');
var filePath = path.resolve(tranverteDir);
const SIDEBARNAME='_sidebar.md';
const READMENAME='readme.md';
//调用文件遍历方法
tranverseFile(filePath);
/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function tranverseFile(filePath,sideBarFile=""){
    handleSingleFile(filePath,sideBarFile)
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            files=files.filter(function (filename) {
                var lowerFileName=filename.toLowerCase();
                if(lowerFileName==SIDEBARNAME||lowerFileName==READMENAME){
                    return false;
                }else {
                    return true;
                }
            });
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                handleSingleFile(filedir,sideBarFile,true);
            });
        }
    });
}
function handleSingleFile(filedir,sideBarFile,isTranverse=false){
    fs.stat(filedir,function(eror,stats){
        if(eror){
            console.warn('获取文件stats失败');
        }else{
            var isFile = stats.isFile();//是文件
            var isDir = stats.isDirectory();//是文件夹
            console.log(filedir)
            if(isDir){
                if(sideBarFile.endsWith(SIDEBARNAME)){
                    appendMainTile(filedir,sideBarFile);
                }
                sideBarFile=createsidebar(filedir)
                if(isTranverse){
                    tranverseFile(filedir,sideBarFile);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                }
            }
            if(isFile&&sideBarFile.endsWith(SIDEBARNAME)){
                appendTile(filedir,sideBarFile);
            }
        }
    })
}
function createsidebar(filedir) {
    var title=path.basename(filedir);
    var sidebarPath=path.join(filedir,SIDEBARNAME);
    fs.writeFileSync(sidebarPath,'* '+title+os.EOL);
    return sidebarPath;
}
function appendTile(filedir,sideBarFile) {
    var filename=path.basename(filedir);
    filename=filename.substr(0,filename.length-path.extname(filedir).length);
    var link=filedir.substr(workdir.length,filedir.length)
    var tile= ' * ['+filename+']('+link+')';
    fs.appendFileSync(sideBarFile,tile.replace(/\\/g,'/')+os.EOL)
}
function appendMainTile(filedir,sideBarFile) {
    var link=filedir.substr(workdir.length,filedir.length)
    var mainTile=' * ['+path.basename(filedir)+']('+link+'/)';
    fs.appendFileSync(sideBarFile,mainTile.replace(/\\/g,'/')+os.EOL);
}

