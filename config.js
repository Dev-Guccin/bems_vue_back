let config = {
  dbconfig: {
    host: 'localhost',
    user: 'root',
    password: '4msys',
    database: 'bems',
  },
  bacnetconfig: {
    port: 47808, //bacnet의 기본 주소
    interface: '192.168.219.101',
    broadcastAddress: '192.168.219.255',
    apduTimeout: 10000,
  },
}

module.exports = config
