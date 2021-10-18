let express = require('express')
let Handler = require('../utils/handler')
let router = express.Router()

// modbus 제어, bacnet제어, database제어
// 3가지 모두 pm2를 사용하여 제어를 진행한다.
//api/settings/restart_only/modbus
router.get('/restart_only/:module', function (req, res, next) {
  console.log('restart_only_module : ', req.params.module)
  Handler.restart_only(req.params.module)
  res.send('respond with a resource')
})
router.get('/stop_only/:module', function (req, res, next) {
  console.log('stop_only_module : ', req.params.module)
  Handler.stop_only(req.params.module)
  res.send('respond with a resource')
})
router.get('/stop_all', function (req, res, next) {
  console.log('stop_all')
  Handler.stop_all()
  res.send('respond with a resource')
})
router.get('/module_check', async function (req, res, next) {
  console.log('module_check')
  let checklist = await Handler.module_check()
  res.send(checklist)
})

router.get('/module_log_check/:module/:type', async function (req, res, next) {
  console.log('module_log_check')
  let module = req.params.module
  let type = req.params.type
  let log_data = await Handler.get_logfile(module, type)
  res.send(log_data)
})

module.exports = router
