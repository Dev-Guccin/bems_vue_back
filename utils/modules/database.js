var mysql = require('mysql')

const config = require('../../config')

const connection = mysql.createConnection(config.dbconfig)
connection.connect()

var Database = {
  device_delete: function (tablename) {
    return new Promise(function (resolve, reject) {
      connection.query(`DELETE FROM ${tablename}`, (error, rows, fields) => {
        if (error) throw error
        resolve()
      })
    })
  },
  get_targetChannels: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT * FROM modbus_channel WHERE network_id=${id}`,
        (error, rows, fields) => {
          if (error) throw error
          resolve(rows)
        }
      )
    })
  },
  get_targetdatas: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT * FROM modbus_data WHERE m_channel=${id}`,
        (error, rows, fields) => {
          if (error) throw error
          resolve(rows)
        }
      )
    })
  },

  channel_inc: function (column, id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `UPDATE modbus_channel SET ${column} = (${column} + 1)%1000 
            WHERE id = ${id}`,
        (error, rows, fields) => {
          if (error) throw error
          resolve()
        }
      )
    })
  },
  realtime_upsert: function (id, object_name, resData, object_type) {
    connection.query(
      `insert into realtime_table (id, object_name, log_value , log_time ,object_type, network_type )
        values (${id},'${object_name}', ${resData}, now(),'${object_type}','mysql') as t
        on duplicate key update log_value  = t.log_value , log_time  = t.log_time `,
      (error, rows, fields) => {
        if (error) throw error
      }
    )
  },
  batch_insert: function (table_name, object_name, value) {
    connection.query(
      `INSERT INTO ${table_name} (object_name, log_time , log_value) 
        VALUES ("${object_name}",now(),${value})`,
      (error, rows, fields) => {
        if (error) throw error
      }
    )
  },
  //output에 사용하는 함수
  select_not_null: function (network_type) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT * from realtime_table where ctrl_value is not null and network_type = '${network_type}'`,
        (error, rows, fields) => {
          if (error) throw error
          resolve(rows)
        }
      )
    })
  },
  get_object_info: function (object_name) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `select N.network_type, N.address, N.port, C.device_address, D.m_w_scale, D.m_w_offset,  D.m_w_fc,  D.m_dattype,  D.m_w_addr 
        from modbus_data D inner join modbus_channel C on D.m_channel = C.id 
        inner join modbus_network N on D.m_network = N.id 
        where D.object_name = '${object_name}'`,
        (error, rows, fields) => {
          if (error) throw error
          resolve(rows[0])
        }
      )
    })
  },
  recover_realtime: function (object_name) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `update realtime_table set ctrl_value  = null where object_name = '${object_name}'`,
        (error, rows, fields) => {
          if (error) throw error
          resolve()
        }
      )
    })
  },
  device_insert: function (page, data) {
    if (page == 0) {
      //Channel
      return new Promise(function (resolve, reject) {
        try {
          connection.query(
            `INSERT INTO modbus_network (id, name, network_type, address, port, period, wait_time, active) 
                VALUES(${data.id},'${data.name}','${data.network_type}','${data.address}',${data.port},${data.period},${data.wait_time},${data.active})`,
            (error, rows, field) => {
              if (error) throw error
              resolve()
            }
          )
        } catch (e) {
          console.log(e)
        }
      })
    } else if (page == 1) {
      //Frame
      return new Promise(function (resolve, reject) {
        try {
          connection.query(
            `INSERT INTO modbus_channel (id, name, network_id, function_code, device_address,start_address, quantity, active)
                VALUES(${data.id},'${data.name}',${data.network_id},${data.function_code},${data.device_address},${data.start_address},${data.quantity},${data.active})`,
            (error, rows, field) => {
              if (error) throw error
              resolve()
            }
          )
        } catch (e) {
          console.log(e)
        }
      })
    } else {
      //Detail
      return new Promise(function (resolve, reject) {
        try {
          connection.query(
            `INSERT INTO modbus_data (object_name, object_type, id, unit, low_limit, high_limit, active, m_network ,m_channel ,m_func ,m_addr ,m_bitoffset  ,m_dattype ,m_r_scale ,m_r_offset ,m_w_id ,m_w_fc ,m_w_addr ,m_w_dattype ,m_w_scale ,m_w_offset )
                VALUES('${data.object_name}','${data.object_type}',${data.id},'${data.unit}','${data.low_limit}','${data.high_limit}',${data.active},${data.m_network},${data.m_channel},${data.m_func},'${data.m_addr}',${data.m_bitoffset},${data.m_dattype},${data.m_r_scale},${data.m_r_offset},${data.m_w_id},${data.m_w_fc},'${data.m_w_addr}',${data.m_w_dattype},${data.m_w_scale},${data.m_w_offset})`,
            (error, rows, field) => {
              if (error) throw error
              resolve()
            }
          )
        } catch (e) {
          console.log(e)
        }
      })
    }
  },
  device_select: function (table, callback) {
    return new Promise(function (resolve, reject) {
      connection.query(`SELECT * from ${table}`, (error, rows, fields) => {
        if (error) throw error
        resolve(rows)
      })
    })
  },
  batch_device_select: function (table, callback) {
    connection.query(`SELECT * from ${table}`, (error, rows, fields) => {
      if (error) throw error
      callback(rows)
    })
  },
  batch_select: function (table_name, object_name, time_interval, callback) {
    connection.query(
      `SELECT avg(log_value) from ${table_name} where object_name = "${object_name}" and log_time  between timestamp(DATE_SUB(NOW(), INTERVAL ${time_interval})) and timestamp(NOW())`,
      (error, rows, fields) => {
        if (error) throw error
        callback(rows)
      }
    )
  },
  /*
        BACNET DATABASE
    */
  set_available: function (data) {
    //ipaddress
    ipadr = data.split(':')
    console.log(ipadr)
    connection.query(
      `UPDATE bacnet_device SET available=1 WHERE address='${
        ipadr[0]
      }' and port=${ipadr[1] != undefined ? parseInt(ipadr[1]) : 47808};`,
      function (error, rows, fields) {
        if (error) {
          console.log(error)
        } else {
        }
      }
    )
  },
  get_bacnet_staion: function (network_id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT * FROM bacnet_station where id=${network_id};`,
        function (error, rows, fields) {
          if (error) {
            console.log(error)
            resolve()
          } else {
            console.log(rows[0])
            resolve(rows[0])
          }
        }
      )
    })
  },
  get_bacnet_device: function (device_id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT * FROM bacnet_device where id=${device_id};`,
        function (error, rows, fields) {
          if (error) {
            console.log(error)
            resolve()
          } else {
            console.log(rows[0])
            resolve(rows[0])
          }
        }
      )
    })
  },
  get_ids_device: async function () {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT id FROM bacnet_device;`,
        function (error, rows, fields) {
          if (error) {
            console.log(error)
            resolve()
          } else {
            resolve(rows)
          }
        }
      )
    })
  },
  get_ids_device_available: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT id, period FROM bacnet_device WHERE id=${id} and active=1 and available=1;`,
        function (error, rows, fields) {
          if (error) {
            console.log(error)
            resolve()
          } else {
            resolve(rows[0])
          }
        }
      )
    })
  },
  get_device_from_id: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT * FROM bacnet_device WHERE id=${id};`,
        function (error, rows, fields) {
          if (error) {
            console.log(error)
            resolve()
          } else {
            resolve(rows[0])
          }
        }
      )
    })
  },
  get_ids_station: function (device_id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT id FROM bacnet_station WHERE device_id=${device_id};`,
        function (error, rows, fields) {
          if (error) {
            console.log(error)
            resolve()
          } else {
            resolve(rows)
          }
        }
      )
    })
  },
  get_station_from_id: function (id) {
    return new Promise(function (resolve, reject) {
      connection.query(
        `SELECT * FROM bacnet_station WHERE id=${id};`,
        function (error, rows, fields) {
          if (error) {
            console.log(error)
            resolve()
          } else {
            resolve(rows[0])
          }
        }
      )
    })
  },

  realtime_upsert_bacnet: function (
    id,
    object_name,
    resData,
    object_type,
    station_id
  ) {
    console.log('INSERT!!! ', id, object_name, resData, object_type)
    connection.query(
      `insert into realtime_table (id, object_name, log_value, log_time,object_type, network_type, network_id)
        values (${id},'${object_name}', ${resData}, now(),'${object_type}','bacnet', ${station_id}) as t
        on duplicate key update log_value = t.log_value, log_time = t.log_time`,
      (error, rows, fields) => {
        if (error) throw error
      }
    )
  },
  delete_table: function (tablename) {
    // // console.log("delete table name ",tablename)
    // connection = mysql.createConnection(dbconfig);
    // connection.connect();
    return new Promise(function (resolve, reject) {
      connection.query(`DELETE FROM ${tablename}`, function (err) {
        // connection.end();
        if (err) {
          console.log(err)
          resolve(false)
        }
        resolve()
      })
    })
  },

  insert_table: function (page, data) {
    // console.log("insert table name ",page)
    // connection = mysql.createConnection(dbconfig);
    // connection.connect();
    if (page == 0) {
      //Device
      return new Promise(function (resolve, reject) {
        connection.query(
          `INSERT INTO bacnet_device (id, name, address, broadcast_address, port,period, active, available) 
                VALUES(${data.Id},'${data.Name}','${data.Address}','${data.Broadcast_Address}', ${data.Port},${data.Period},${data.Active},${data.Available})`,
          function (error, rows, fields) {
            // connection.end();
            if (error) {
              console.log(error)
              resolve(false)
            }
            resolve()
          }
        )
      })
    } else {
      //Station
      return new Promise(function (resolve, reject) {
        connection.query(
          `INSERT INTO bacnet_station (id,object_name,device_id,object,object_type,object_instance,value_type,active)
                VALUES(${data.Id},'${data.Object_Name}',${data.Device_Id},'${data.Object}',${data.Object_type},${data.Object_instance},${data.Value_type},${data.Active})`,
          function (error, rows, fields) {
            // connection.end();
            if (error) {
              console.log(error)
              resolve(false)
            }
            resolve()
          }
        )
      })
    }
  },
}
module.exports = Database
