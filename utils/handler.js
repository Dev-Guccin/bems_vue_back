#!/usr/bin/env node
var fs = require('fs');

var Handler = {
    restart_all: function () {
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
        }
    },
    restart_only: function (target) {
        //config확인을 통해 해당 통신확인
        let active = Handler.get_config()
        console.log(active)
        if (target == "modbus") {
            if (active[0] == 0) {
                return false
            }
            // 해당 통신 종료
            Handler.delete_module("modbus")
            // 재실
            Handler.start_module("modbus", "./utils/modules/Modbus_module.js")
        }
        else if (target == "bacnet") {
            if (active[1] == 0) {
                return false
            }
            // 해당 통신 종료
            Handler.delete_module("bacnet")
            // 재실행
            Handler.start_module("bacnet", "./utils/modules/Bacnet_module.js")

        }
        else if (target == "database") {
            if (active[2] == 0) {
                return false
            }
            // 해당 통신 종료
            Handler.delete_module("database")
            // 재실행
            Handler.start_module("database", "./utils/modules/Database_module.js")
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
        console.log("[+] delete module :", filename)
        var pm2 = require('pm2')
        pm2.connect(function (err) {
            if (err) {
                console.error(err)
                process.exit(2)
            }
            pm2.delete(filename, function (err, apps) {
                if (err) {
                    console.error(err)
                    return pm2.disconnect()
                }
                pm2.list((err, list) => {
                    console.log(err, list)
                    pm2.restart('api', (err, proc) => {
                        // Disconnects from PM2
                        pm2.disconnect()
                    })
                })
            })
        })
    },
    start_module: function (filename, filepath) {
        console.log("[+] start moduel : ", filename,"   path:",filepath)
        var pm2 = require('pm2')
        pm2.connect(function (err) {
            if (err) {
                console.error(err)
                process.exit(2)
            }
            pm2.start({
                script: filepath,
                name: filename,
                autorestart: false
            }, function (err, apps) {
                if (err) {
                    console.error(err)
                    return pm2.disconnect()
                }
                pm2.list((err, list) => {
                    console.log(err, list)
                    pm2.restart('api', (err, proc) => {
                        // Disconnects from PM2
                        pm2.disconnect()
                    })
                })
            })
        })
    },
    stop_module: function(filename){
        console.log("[+] stop moduel : ", filename)
        var pm2 = require('pm2')
        pm2.connect(function (err) {
            if (err) {
                console.error(err)
                process.exit(2)
            }
            pm2.stop({
                name: filename,
            }, function (err, apps) {
                if (err) {
                    console.error(err)
                    return pm2.disconnect()
                }
                pm2.list((err, list) => {
                    console.log(err, list)
                    pm2.restart('api', (err, proc) => {
                        // Disconnects from PM2
                        pm2.disconnect()
                    })
                })
            })
        })
    }
}

module.exports = Handler