var mysql = require('mysql')
var dbconfig = {
    host     : 'localhost',
    user     : 'root',
    password : '4msys',
    database : 'bems'
  }
const connection = mysql.createConnection(dbconfig);
connection.connect();

var Database = {
    device_delete:  function(tablename){
        return new Promise(function(resolve, reject) {
            connection.query(`DELETE FROM ${tablename}` , (error, rows, fields) => {
                if (error) throw error;
                resolve();
            });
          });
    },
    channel_inc: function(column, id){
        return new Promise(function(resolve, reject) {
            connection.query(`UPDATE modbus_channel SET ${column} = (${column} + 1)%1000 
            WHERE id = ${id}` , (error, rows, fields) => {
                if (error) throw error;
                resolve();
            });
          });
    },
    realtime_upsert:function(id,object_name, resData, object_type){
        connection.query(`insert into realtime_table (id, object_name, log_value , log_time ,object_type, network_type )
        values (${id},'${object_name}', ${resData}, now(),'${object_type}','mysql') as t
        on duplicate key update log_value  = t.log_value , log_time  = t.log_time `, (error, rows, fields) => {
            if (error) throw error;
        });
    },
    batch_insert: function(table_name, object_name, value){
        connection.query(`INSERT INTO ${table_name} (object_name, log_time , log_value) 
        VALUES ("${object_name}",now(),${value})`, (error, rows, fields) => {
            if (error) throw error;
        });   
    },//output에 사용하는 함수
    select_not_null : function(network_type ){
        return new Promise(function(resolve, reject) {
            connection.query(`SELECT object_name, ctrl_value from realtime_table where ctrl_value is not null and network_type = '${com_type}'`, (error, rows, fields) => {
                if (error) throw error;
                resolve(rows);
            });
          });
    },
    get_modbus_data : function(object_name){
        return new Promise(function(resolve, reject) {
            connection.query(`select * from modbus_data where object_name = '${object_name}'`, (error, rows, fields) => {
                if (error) throw error;
                resolve(rows[0]);
            });
          });
    },
    get_ip_addr : function(id){
        return new Promise(function(resolve, reject) {
            try{
                connection.query(`select address,port from modbus_network where id = ${id}`, (error, rows, fields) => {
                    if (error) throw error;
                    resolve(rows[0]);
                });
            }catch(e){
            console.log(e)
            }
        });
    },
    recover_realtime: function(object_name){
        return new Promise(function(resolve, reject) {
            connection.query(`update realtime_table set ctrl_value  = null where object_name = '${object_name}'`, (error, rows, fields) => {
                if (error) throw error;
                resolve();
            });
          });
    },
    device_insert: function(page,data){
        if(page == 0){//Channel
            return new Promise(function(resolve, reject) {
                try{
                connection.query(`INSERT INTO modbus_network (id, name, network_type, address, port, period, wait_time, active) 
                VALUES(${data.id},'${data.name}','${data.network_type }','${data.address }',${data.port },${data.period },${data.wait_time },${data.active })`, (error,rows,field) => {
                    if(error) throw error;
                    resolve();
                });
                }catch(e){
                    console.log(e)
                }
    
              });
        }
        else if(page == 1){//Frame
            return new Promise(function(resolve, reject) {
                try{
                connection.query(`INSERT INTO modbus_channel (id, name, network_id, function_code, device_address,start_address, quantity, active)
                VALUES(${data.id },'${data.name }',${data.network_id },${data.function_code },${data.device_address },${data.start_address },${data.quantity },${data.active })`,(error,rows,field) => {
                    if(error) throw error;
                    resolve();
                });
                }catch(e){
                    console.log(e)
                }
              });
        }
        else{//Detail
            return new Promise(function(resolve, reject) {
                try{
                connection.query(`INSERT INTO modbus_data (object_name, object_type, id, unit, low_limit, high_limit, active, m_network ,m_channel ,m_func ,m_addr ,m_bitoffset  ,m_dattype ,m_r_scale ,m_r_offset ,m_w_id ,m_w_fc ,m_w_addr ,m_w_dattype ,m_w_scale ,m_w_offset )
                VALUES('${data.object_name}','${data.object_type}',${data.id},'${data.unit}','${data.low_limit}','${data.high_limit}',${data.active},${data.m_network},${data.m_channel},${data.m_func},'${data.m_addr}',${data.m_bitoffset},${data.m_dattype},${data.m_r_scale},${data.m_r_offset},${data.m_w_id},${data.m_w_fc},'${data.m_w_addr}',${data.m_w_dattype},${data.m_w_scale},${data.m_w_offset})`, (error,rows,field) => {
                    if(error) throw error;
                    resolve();
                });
                }catch(e){
                    console.log(e)
                }
              });
           }
    },
    device_select: function(table, callback){
        return new Promise(function(resolve, reject) {
            connection.query(`SELECT * from ${table}`, (error, rows, fields) => {
                if (error) throw error;
                resolve(rows);
            })
        })
    },
    batch_device_select : function(table, callback){
        connection.query(`SELECT * from ${table}`, (error, rows, fields) => {
            if (error) throw error;
            callback(rows);
        })
    },
    batch_select : function(table_name,object_name, time_interval,callback){
        connection.query(`SELECT avg(log_value) from ${table_name} where object_name = "${object_name}" and log_time  between timestamp(DATE_SUB(NOW(), INTERVAL ${time_interval})) and timestamp(NOW())`, (error, rows, fields) => {
            if (error) throw error;
            callback(rows);
        });
    },
    
}
module.exports = Database