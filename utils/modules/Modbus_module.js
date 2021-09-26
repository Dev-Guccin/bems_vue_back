'use strict'
const DBH = require('./database.js')
const Modbus = require('jsmodbus')
const SerialPort = require('serialport')
const net = require('net')
let Excel = require('./get_excel.js')
const sockets = []
const clients = []
const rtu_clients = []

let Networks = new Array()
let Channels = {}
let Datas = {}
let channel_range = {}
modbus_poll()

async function modbus_poll() {
  await Excel.loadExcelFile_modbus()
  await getInfo()
  //modbus poll시작하기 전에 excel정합성 확인
  for (let key in channel_range) {
    let h = channel_range[key].start
    let t = channel_range[key].end
    for (let i = 0; i < Datas[key].length; i++) {
      console.log(Datas[key][i])
      if (Datas[key][i].m_addr < h || Datas[key][i].m_addr > t) {
        console.log(h, t, Datas[key][i].m_addr)
        console.log('excel error in detail id ', Datas[key][i].id)
        return
      }
    }
  }
  console.log('excel 정합성ok')
  console.log('start 통신') //,Networks, Channels, Datas)
  modbusStart()
}

function getInfo() {
  return new Promise(async function (resolve, reject) {
    try {
      let rows = await DBH.device_select('modbus_network')
      rows.forEach((row) => {
        let tmp = {}
        tmp.id = row['id']
        // tmp.name = row["name"] //사용되지 않음
        tmp.network_type = row['network_type']
        tmp.address = row['address']
        tmp.port = row['port']
        tmp.period = row['period']
        tmp.wait_time = row['wait_time']
        tmp.active = row['active']
        Networks.push(tmp) //리스트에 패킷데이터를 저장한다.
        Channels[tmp.id] = [] //ChannelName을 key값으로 리스트를 생성해준다. 리스트에는 frames들이 들어갈계획
      })
      rows = await DBH.device_select('modbus_channel')
      rows.forEach((row) => {
        let tmp = {}
        let r = {}
        tmp.id = row['id']
        // tmp.fr_name = row["name"]
        tmp.network_id = row['network_id']
        tmp.function_code = row['function_code']
        tmp.device_address = row['device_address']
        tmp.start_address = row['start_address']
        tmp.quantity = row['quantity']
        tmp.active = row['active']
        Channels[tmp.network_id].push(tmp) //channelname에 맞게 리스트에 차례로 삽입한다. 나중에 패킷 보낼때 사용함.'
        Datas[tmp.id] = []
        r.start = tmp.start_address
        r.end = tmp.start_address + tmp.quantity - 1
        channel_range[tmp.id] = r
      })
      rows = await DBH.device_select('modbus_Data')
      rows.forEach((row) => {
        let tmp = {}
        tmp.object_name = row['object_name']
        tmp.object_type = row['object_type']
        if (tmp.object_type.charAt(0) == 'B') {
          tmp.m_addr = parseInt(row['m_addr'], 16)
          // tmp.m_w_addr = parseInt(row['m_w_addr'], 16)
        } else {
          tmp.m_addr = parseInt(row['m_addr'])
          // tmp.m_w_addr = parseInt(row['m_w_addr'])
        }
        tmp.id = row['id']
        tmp.units = row['unit']
        tmp.low_limit = row['low_limit']
        tmp.high_limit = row['high_limit']
        tmp.active = row['active']
        // tmp.m_network = row['m_network']
        tmp.m_channel = row['m_channel']
        tmp.m_func = row['m_func']
        tmp.m_bitoffset = row['m_bitoffset']
        tmp.m_dattype = row['m_dattype']
        tmp.m_r_scale = row['m_r_scale']
        tmp.m_r_offset = row['m_r_offset']
        Datas[tmp.m_channel].push(tmp)
      })
      console.log('info 완료')
      resolve()
    } catch (e) {
      console.log('get network info error : ', e)
    }
  })
}

function modbusStart() {
  for (let i = 0; i < Networks.length; i++) {
    // 소켓을 설정하고 열어준다.
    if (Networks[i].active == 0) continue

    if (Networks[i].network_type == 'tcp/ip') {
      sockets[i] = new net.Socket() //socket을 객체로 다루기 위해 설정해준다.
      clients[i] = new Modbus.client.TCP(sockets[i]) // tcp를 열어준다.
      //tcp설정
      let options = {
        host: Networks[i].address,
        port: Networks[i].port,
        autoReconnect: true,
        timeout: Networks[i].wait_time,
      }

      sockets[i].on('connect', async function () {
        //소켓이 연결되는 경우 어떻게 사용할 건지
        console.log('connected!!!!', Networks[i].address)
        let targetchannels = Channels[Networks[i].id]
        console.log('targetFrame!!!', targetchannels)
        setInterval(() => {
          console.log('SetInterval!')
          for (let fi = 0; fi < targetchannels.length; fi++) {
            //frame의 개수만큼 반복하는 코드
            console.log('check:', fi)
            if (targetchannels[fi].active == 1) {
              let func
              // active 상태일때만 반복시킴
              // console.log("타켓을 보자", targetchannels[fi])
              switch (targetchannels[fi].function_code) {
                case 0: //Read Coils
                  func = clients[i].readCoils(
                    targetchannels[fi].start_address,
                    targetchannels[fi].quantity
                  )
                  break
                case 1: //Read Discrete Input
                  func = clients[i].readDiscreteInputs(
                    targetchannels[fi].start_address,
                    targetchannels[fi].quantity
                  )
                  break
                case 3: //Read Holding Registers
                  func = clients[i].readHoldingRegisters(
                    targetchannels[fi].start_address,
                    targetchannels[fi].quantity
                  )
                  break
                case 4: //Read Input Registers
                  func = clients[i].readInputRegisters(
                    targetchannels[fi].start_address,
                    targetchannels[fi].quantity
                  )
                  break
              }
              DBH.channel_inc('tx', targetchannels[fi].id)
              func
                .then(function (resp) {
                  response_process(targetchannels[fi], resp)
                })
                .catch(function () {
                  DBH.channel_inc('err', targetchannels[fi].id)
                  console.log('socket network error')
                  console.log(Networks[i].address)
                  console.error(arguments)
                  //sockets[i].end() 오류가 생겨도 닫지 않는다. 다른 frame 통신을 위해서
                })
            }
          }
        }, Networks[i].period)
      })
      sockets[i].on('error', function () {
        //에러가 발생하면 어떻게 할건지
        console.log('errored !!!!!!', Networks[i].address)
      })
      sockets[i].connect(options) // 실제로 포트를 열어준다.
    } else if (Networks[i].network_type == 'rtu') {
      // 소켓을 열어준다.
      sockets[i] = new SerialPort(Networks[i].address, {
        baudRate: 9600,
      })
      rtu_clients[i] = []
      sockets[i].on('open', async function () {
        let targetchannels = Channels[Networks[i].id] // ip의 id에 해당하는 데이터들을 가져온다.
        setInterval(async () => {
          for (let fi = 0; fi < targetchannels.length; fi++) {
            // socket과 slave_id를 통해 clients를 열어준다.
            // device_id를 뽑아서 확인한다.
            let slave_id = targetchannels[fi].device_address
            if (rtu_clients[i][slave_id] == undefined) {
              rtu_clients[i][slave_id] = new Modbus.client.RTU(
                sockets[i],
                slave_id
              ) // 선언해서 device_id로 rtu 연동한다.
            }
            if (targetchannels[fi].active == 1) {
              // active 상태일때만 반복시킴
              switch (targetchannels[fi].function_code) {
                case 0: //Read Coils
                  func = rtu_clients[i][slave_id].readCoils(
                    targetchannels[fi].start_address,
                    targetchannels[fi].quantity
                  )
                  break
                case 1: //Read Discrete Input
                  func = rtu_clients[i][slave_id].readDiscreteInputs(
                    targetchannels[fi].start_address,
                    targetchannels[fi].quantity
                  )
                  break
                case 3: //Read Holding Registers
                  func = rtu_clients[i][slave_id].readHoldingRegisters(
                    targetchannels[fi].start_address,
                    targetchannels[fi].quantity
                  )
                  break
                case 4: //Read Input Registers
                  func = rtu_clients[i][slave_id].readInputRegisters(
                    targetchannels[fi].start_address,
                    targetchannels[fi].quantity
                  )
                  break
              }
            }
            DBH.channel_inc('tx', targetchannels[fi].id)
            await func
              .then(function (resp) {
                response_process(targetchannels[fi], resp)
              })
              .catch(function () {
                DBH.channel_inc('err', targetchannels[fi].id)
                console.log('socket network error')
                console.log(Networks[i].address)
                console.error(arguments)
              })
          }
        }, Networks[i].period)
      })
    }
  }
}

function response_process(targetchannels_fi, resp) {
  DBH.channel_inc('rx', targetchannels_fi.id)
  let se, sensors, targetIdx, resData
  let modbus_result = resp.response._body._valuesAsBuffer
  //console.log(modbus_result, Buffer.byteLength(modbus_result, 'utf8'), targetchannels_fi.quantity)
  //이제 여기서 데이터를 정규화 하는 작업 해야함
  sensors = Datas[targetchannels_fi.id] //detail객체
  if (sensors === undefined || sensors.length == 0) return //Detail이 정의되어 있지 않은 경우 연산없이 넘긴다.
  //console.log("set read:", targetchannels_fi.start_address, targetchannels_fi.quantity)
  for (se = 0; se < sensors.length; se++) {
    if (sensors[se].active == 0) continue
    try {
      // if (sensors[se].object_type.charAt(0) == 'B'){ //binary값인 경우
      //     targetIdx = parseInt((sensors[se].m_addr - targetchannels_fi.start_address)/8)
      //     res = "00000000" + parseInt(modbus_result.slice(targetIdx,targetIdx + 1).toString('hex'),16).toString(2)
      //     // console.log('결과 비트',res)
      //     bitoffset = (sensors[se].m_addr - targetchannels_fi.start_address) % 8
      //     // console.log("비트 ",bitoffset)
      //     resData = res.charAt(res.length-1-bitoffset)
      // }else{
      targetIdx = (sensors[se].m_addr - targetchannels_fi.start_address) * 2
      switch (sensors[se].m_dattype) {
        case 0: //unsigned int 16bit AB
          resData = modbus_result.readUInt16BE(targetIdx)
          break
        case 1: //signed int 16bit AB
          resData = modbus_result.readInt16BE(targetIdx)
          break
        case 2: //2 : 32bit signed int - AB CD
          resData = modbus_result.readInt32BE(targetIdx)
          break
        case 3: //3 : 32bit signed int - CD AB
          let res = modbus_result
            .slice(targetIdx, targetIdx + 8)
            .swap32()
            .swap16()
          resData = res.readInt32BE()
          break
        case 4: // 4 :  32bit signed int - BA DC
          let res = modbus_result.slice(targetIdx, targetIdx + 8).swap16()
          resData = res.readInt32BE()
          break
        case 5: //5 :  32bit signed int - DC BA
          let res = modbus_result.slice(targetIdx, targetIdx + 8).swap32()
          resData = res.readInt32BE()
          break
        case 6: //6 : float  - AB CD
          resData = modbus_result.slice(targetIdx, targetIdx + 8).readFloatLE()
          break
        case 7: //7 : float - CD AB
          let res = modbus_result
            .slice(targetIdx, targetIdx + 8)
            .swap32()
            .swap16()
          resData = res.readFloatBE()
          break
        case 8: //8 : float - BA DC
          let res = modbus_result.slice(targetIdx, targetIdx + 4).swap16()
          resData = res.readFloatBE()
          break
        case 9: //9 : float - DC BA
          let res = modbus_result.slice(targetIdx, targetIdx + 4).swap32()
          resData = res.readFloatBE()
          break
        case 10: //10 : 64bit double - AB CD EF GH
          resData = modbus_result.readDoubleBE(targetIdx)
          break
        case 11: //11 : 64bit double - GH EF CD AB
          let res = modbus_result
            .slice(targetIdx, targetIdx + 8)
            .swap64()
            .swap16()
          resData = res.readDoubleBE()
          break
        case 12: //12 : 64bit double - BA DC FE HG
          let res = modbus_result.slice(targetIdx, targetIdx + 4).swap16()
          resData = res.readDoubleBE()
          break
        case 13: //13 : 64bit double - HG FE DC BA
          let res = modbus_result.slice(targetIdx, targetIdx + 8).swap64()
          resData = res.readDoubleBE()
          break
        case 14: //14 : 1bit value
          //이부분 맞는지 확인 필요
          console.log('modbus_result : ', modbus_result)
          if (
            targetchannels_fi.function_code == 3 ||
            targetchannels_fi.function_code == 4
          ) {
            //아날로그로 읽는 경우
            if (
              modbus_result.readInt16BE(targetIdx) &
              (1 << (15 - sensors[se].m_bitoffset))
            ) {
              resData = 1
            } else {
              resData = 0
            }
          } else {
            //바이너리로 읽어오는 경우
            if (
              modbus_result.readInt8(
                parseInt((sensors[se].m_bitoffset + 1) / 8)
              ) &
              (1 << (((sensors[se].m_bitoffset + 1) % 8) - 1))
            )
              resData = 1
            else resData = 0
          }
          break
      }
      // }
    } catch (e) {
      console.log('data transform error : ', e)
      resData = NaN //받는데이터가 요청한 데이터보다 짧을때 처리(na)
    }
    if (resData != NaN) {
      //console.log("resData:", resData, "(id:", sensors[se].id, ")")
      DBH.realtime_upsert(
        sensors[se].id,
        sensors[se].object_name,
        sensors[se].m_r_scale * resData + sensors[se].m_r_offset,
        sensors[se].object_type
      )
    }
  }
}
