'use strict'
const modbus = require('jsmodbus')
const net = require('net')
const { resolve } = require('path')
const socket = new net.Socket()
const options = {
    'host': '192.168.0.41',
    'port': '502'

}
const client = new modbus.client.TCP(socket)

socket.on('connect', async function () {
    console.log("connected!!!!")
    let tmp = await client.readHoldingRegisters(0, 18)
    console.log("tmp:",tmp.response.body.valuesAsBuffer)
    console.log("connected!22222!!!")
    let tmp2 = await client.readHoldingRegisters(0, 18)
    console.log("tmp2:",tmp2.response.body.valuesAsBuffer)
})

socket.on('error', console.error)
socket.on('data', (data) => { console.log(data) })
socket.connect(options)