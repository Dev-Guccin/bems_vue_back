#!/usr/bin/env node
let fs = require('fs');

let Handler = {
    restart_all: function () {// 미완성
        //config파일 확인하기
        let active = Handler.get_config()
        // 해당 통신모듈 전부 삭제
        // 이때 딜레이 줘야하는지 아닌지 고민좀 해볼것
        if(active[0] == 1){
            Handler.delete_module("modbus")
            Handler.start_module("modbus", "./utils/module/Modbus_module/modbus_control.js")
        }else if(active[1] == 1){
            Handler.delete_module("bacnet")
            Handler.start_module("bacnet", "./utils/module/Bacnet_module/bacnet_control.js")
        }else if(active[2] == 1){
            Handler.delete_module("database")
            Handler.start_module("database", "./utils/module/Database_module/database_control.js")
        }else{

        }
    },
    restart_only: async function (target) {
        //config확인을 통해 해당 통신확인
        let active = Handler.get_config()
        console.log(active)
        if (target == "modbus") {
            if (active[0] == 0) {
                return false
            }
            await Handler.delete_module("modbus")// 해당 통신 종료
            Handler.start_module("modbus", "./utils/modules/Modbus_module.js")// 재실행
        }
        else if (target == "bacnet") {
            if (active[1] == 0) {
                return false
            }
            await Handler.delete_module("bacnet")// 해당 통신 종료
            Handler.start_module("bacnet", "./utils/modules/Bacnet_module.js")// 재실행

        }
        else if (target == "database") {
            if (active[2] == 0) {
                return false
            }
            await Handler.delete_module("database")// 해당 통신 종료
            Handler.start_module("database", "./utils/modules/Database_module.js")// 재실행
        }
        else if (target == "batch") {
            await Handler.delete_module("batch")// 해당 통신 종료
            Handler.start_module("batch", "./utils/modules/Batch_module.js")// 재실행
        }
        else {//target == wrong
            console.log("target wrong")
            return false
        }
    },
    stop_all: function(){
        Handler.stop_module("modbus")
        Handler.stop_module("bacnet")
        Handler.stop_module("database")
        Handler.stop_module("batch")
    },
    stop_only: function (target) {
        //config확인을 통해 해당 통신확인
        let active = Handler.get_config()
        console.log(active)
        if (target == "modbus") {
            if (active[0] == 0) {
                return false
            }
            Handler.stop_module("modbus")
        }
        else if (target == "bacnet") {
            if (active[1] == 0) {
                return false
            }
            Handler.stop_module("bacnet")
        }
        else if (target == "database") {
            if (active[2] == 0) {
                return false
            }
            Handler.stop_module("database")
        }
        else if (target == "batch") {
            Handler.stop_module("batch")
        }
        else {//target == wrong
            console.log("target wrong")
            return false
        }
    },
    get_config: function () {
        const article = fs.readFileSync("./uploads/config.txt");
        lineArray = article.toString().split('\n');
        let active = new Array()
        for (let i = 1; i < lineArray.length; i++) {
            if (lineArray[i].split("=")[1] == 1)
                active.push(1)
            else
                active.push(0)
        }
        return active
    },
    delete_module: function (filename) {
        return new Promise(async function(resolve, reject) {
            console.log("[+] delete module :", filename)
            let pm2 = require('pm2')
            pm2.connect(function (err) {
                if (err) {
                    console.error(err)
                    resolve(false)
                }
                pm2.list((err, list) => {
                    list.forEach(element => {
                        if(element.name == filename){//모듈이 돌고 있는것을 찾으면 종료시킨다.
                            console.log("[+] found module!!!", element.name)
                            pm2.delete(filename, function (err, apps) {
                                if (err) {
                                    console.error(err)
                                    pm2.disconnect()
                                }
                                pm2.disconnect()
                                resolve(true)
                            })
                        }
                    });
                    pm2.disconnect()
                    resolve(false)
                })
            })
        });
    },
    delete_logfile: function(filePath){
        fs.access(filePath, fs.constants.F_OK, (err) => { // A
            if (err) return console.log('삭제할 수 없는 파일입니다');
            fs.unlink(filePath, (err) => err ?  
              console.log(err) : console.log(`${filePath} 를 정상적으로 삭제했습니다`));
        });
    },
    get_logfile: async function(fileName, fileType){
        return new Promise(async function(resolve, reject) {
            let filePath = __dirname+`/log/${fileName}-${fileType}.log`
            fs.readFile(filePath, 'utf8', function(err, data){
                resolve(data)
            });
        });
    },
    start_module: function (fileName, filePath) {
        console.log("[+] start moduel : ", fileName,"   path:",filePath)
        let pm2 = require('pm2')
        pm2.connect(function (err) {
            if (err) {
                console.error(err)
                process.exit(2)
            }
            Handler.delete_logfile(__dirname+`/log/${fileName}-out.log`);
            Handler.delete_logfile(__dirname+`/log/${fileName}-err.log`);
            pm2.start({
                script: filePath,
                name: fileName,
                autorestart: false,
                //merge_logs: true,
                //combine_logs: true,
                env:{
                    pm_out_log_path :__dirname+`/log/${fileName}-out.log`,
                    pm_err_log_path :__dirname+`/log/${fileName}-err.log`,
                },
            }, function (err, apps) {
                if (err) {
                    console.error(err)
                    return pm2.disconnect()
                }
                pm2.disconnect()
            })
        })
    },
    stop_module: function(filename){
        console.log("[+] stop module : ", filename)
        let pm2 = require('pm2')
        pm2.connect(function (err) {
            if (err) {
                console.error(err)
                process.exit(2)
            }
            pm2.list((err, list) => {
                console.log(err, list)
                list.forEach(element => {
                    if(element.name == filename){//모듈이 돌고 있는것을 찾으면 종료시킨다.
                        console.log("[+] found module!!!", element.name)
                        pm2.stop(filename, function (err, apps) {
                            if (err) {
                                console.error(err)
                                return pm2.disconnect()
                            }
                            pm2.disconnect()
                        })
                    }
                });
            })
        })
    },
    module_check: function(){
        return new Promise(async function(resolve, reject) {
            let pm2 = require('pm2')
            pm2.connect(function (err) {
                if (err) {
                    console.error(err)
                    resolve({'state':'error'})
                }
                pm2.list((err, list) => {
                    let checklist = {'modbus':'', 'bacnet':'', 'database':'', 'batch':''};
                    list.forEach(element => {
                        if(checklist[element.name]!=undefined){
                            if(element.pm2_env.status == 'online')
                                checklist[element.name]='online'
                            else if(element.pm2_env.status == 'stopped')
                                checklist[element.name]='stopped'
                        }
                    });
                    console.log(checklist)
                    resolve(checklist);
                });
            });
        });
    },
}

module.exports = Handler