'use strict'
const ExcelJS = require('exceljs')
const DBH = require('./database.js')
const filePath = './uploads/Modbus.xlsx'
const BacnetfilePath = './uploads/Bacnet.xlsx'
var Excel = {
  loadExcelFile_modbus: function () {
    return new Promise(async function (resolve, reject) {
      try {
        var page, i
        var sheetData
        const workbook = new ExcelJS.Workbook() // 엑셀의 객체
        await workbook.xlsx.readFile(filePath)
        for (page = 0; page < 3; page++) {
          sheetData = []
          const worksheet = workbook.worksheets[page] // 첫 번째 sheet 선택
          const options = { includeEmpty: true }
          // worksheet에 접근하여 데이터를 읽어옴
          await worksheet.eachRow(options, (row, rowNum) => {
            sheetData[rowNum] = []
            row.eachCell(options, (cell, cellNum) => {
              sheetData[rowNum][cellNum] = {
                value: cell.value,
                style: cell.style,
              }
            })
          })
          if (page == 0) {
            // network 페이지
            await DBH.device_delete('modbus_network') // DB깔끔하게 밀어버리기
            for (i = 2; i < sheetData.length; i++) {
              if (sheetData[i][1].value == '*') break
              let Network = {}
              Network.id = sheetData[i][1].value
              Network.name = sheetData[i][2].value
              Network.network_type = sheetData[i][3].value
              Network.address = sheetData[i][4].value
              Network.port = sheetData[i][5].value
              Network.period = sheetData[i][6].value
              Network.wait_time = sheetData[i][7].value
              Network.active = sheetData[i][8].value

              await DBH.device_insert(page, Network)
            }
          } else if (page == 1) {
            //channel 페이지
            await DBH.device_delete('modbus_channel') // DB깔끔하게 밀어버리기
            for (i = 2; i < sheetData.length; i++) {
              if (sheetData[i][1].value == '*') break
              let Channel = {}
              Channel.id = sheetData[i][1].value
              Channel.name = sheetData[i][2].value
              Channel.network_id = sheetData[i][3].value
              Channel.function_code = sheetData[i][4].value
              Channel.device_address = sheetData[i][5].value
              Channel.start_address = sheetData[i][6].value
              Channel.quantity = sheetData[i][7].value
              Channel.active = sheetData[i][8].value

              await DBH.device_insert(page, Channel)
            }
          } else {
            //Data 페이지
            await DBH.device_delete('modbus_data') // DB깔끔하게 밀어버리기
            await DBH.device_delete('realtime_table') // 성연아 이거 밀어버리는게 맞나?
            for (i = 2; i < sheetData.length; i++) {
              if (sheetData[i][1].value == '*') break
              let Data = {}
              Data.object_name = sheetData[i][1].value
              Data.object_type = sheetData[i][2].value
              Data.id = sheetData[i][3].value
              Data.unit =
                typeof sheetData[i][4] === 'undefined'
                  ? ''
                  : sheetData[i][4].value
              Data.low_limit = sheetData[i][5].value
              Data.high_limit = sheetData[i][6].value
              Data.active = sheetData[i][7].value
              Data.m_network = sheetData[i][8].value
              Data.m_channel = sheetData[i][9].value
              Data.m_func = sheetData[i][10].value
              Data.m_addr = sheetData[i][11].value
              Data.m_bitoffset = sheetData[i][12].value
              Data.m_dattype = sheetData[i][13].value
              Data.m_r_scale = sheetData[i][14].value
              Data.m_r_offset = sheetData[i][15].value
              Data.m_w_id =
                typeof sheetData[i][16] === 'undefined'
                  ? null
                  : typeof sheetData[i][16].value.result === 'undefined'
                  ? sheetData[i][16].value
                  : sheetData[i][16].value.result
              Data.m_w_fc =
                typeof sheetData[i][17] === 'undefined'
                  ? null
                  : typeof sheetData[i][17].value.result === 'undefined'
                  ? sheetData[i][17].value
                  : sheetData[i][17].value.result
              Data.m_w_addr =
                typeof sheetData[i][18] === 'undefined'
                  ? null
                  : typeof sheetData[i][18].value.result === 'undefined'
                  ? sheetData[i][18].value
                  : sheetData[i][18].value.result
              Data.m_w_dattype =
                typeof sheetData[i][19] === 'undefined'
                  ? null
                  : typeof sheetData[i][19].value.result === 'undefined'
                  ? sheetData[i][19].value
                  : sheetData[i][19].value.result
              Data.m_w_scale =
                typeof sheetData[i][20] === 'undefined'
                  ? null
                  : typeof sheetData[i][20].value.result === 'undefined'
                  ? sheetData[i][20].value
                  : sheetData[i][20].value.result
              Data.m_w_offset =
                typeof sheetData[i][21] === 'undefined'
                  ? null
                  : typeof sheetData[i][21].value.result === 'undefined'
                  ? sheetData[i][21].value
                  : sheetData[i][21].value.result

              await DBH.device_insert(page, Data)
            }
          }
        }
        console.log('get_excel완료')
        resolve()
      } catch (e) {
        // console.log("load excel error : " , page, i-1, sheetData[i])
        console.log(e)
      }
    })
  },
  loadExcelFile_bacnet: function () {
    return new Promise(async function (resolve, reject) {
      try {
        const workbook = new ExcelJS.Workbook() // 엑셀의 객체
        await workbook.xlsx.readFile(BacnetfilePath)
        for (let page = 0; page < 2; page++) {
          const sheetData = []
          const worksheet = workbook.worksheets[page] // 첫 번째 sheet 선택
          const options = { includeEmpty: true }
          // worksheet에 접근하여 데이터를 읽어옴
          await worksheet.eachRow(options, (row, rowNum) => {
            sheetData[rowNum] = []
            row.eachCell(options, (cell, cellNum) => {
              sheetData[rowNum][cellNum] = {
                value: cell.value,
                style: cell.style,
              }
            })
          })
          if (page == 0) {
            // Device 페이지
            await DBH.delete_table('bacnet_device') // DB깔끔하게 밀어버리기
            for (let i = 2; i < sheetData.length; i++) {
              if (sheetData[i][1].value == '*') break
              let DEVICE = {}
              DEVICE.Id = sheetData[i][1].value
              DEVICE.Name = sheetData[i][2].value
              DEVICE.Address = sheetData[i][3].value
              DEVICE.Broadcast_Address = sheetData[i][4].value
              DEVICE.Port = sheetData[i][5].value
              DEVICE.Period = sheetData[i][6].value
              DEVICE.Active = sheetData[i][7].value
              DEVICE.Available = sheetData[i][8].value
              // 이걸 DB에 저장해야함
              await DBH.insert_table(page, DEVICE)
            }
          } else if (page == 1) {
            //Station 페이지
            await DBH.delete_table('bacnet_station') // DB깔끔하게 밀어버리기
            for (let i = 2; i < sheetData.length; i++) {
              if (sheetData[i][1].value == '*') break
              let STATION = {}
              STATION.Id = sheetData[i][1].value
              STATION.Object_Name = sheetData[i][2].value
              STATION.Device_Id = sheetData[i][3].value
              STATION.Object = sheetData[i][4].value
              STATION.Object_type = sheetData[i][5].value
              STATION.Object_instance = sheetData[i][6].value
              STATION.Value_type = sheetData[i][7].value
              STATION.Active = sheetData[i][8].value
              // 이걸 DB에 저장해야함
              await DBH.insert_table(page, STATION)
            }
          }
        }
        console.log('get_excel완료')
        resolve()
      } catch (e) {
        console.log('load excel error : ', e)
        resolve()
      }
    })
  },
}
module.exports = Excel
