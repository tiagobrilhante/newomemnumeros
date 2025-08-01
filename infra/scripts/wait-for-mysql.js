// noinspection JSUnresolvedReference

import { exec } from 'node:child_process'

function checkMysql() {
  exec('docker exec basicom-dev mysqladmin ping -h localhost -u root -proot', handleReturn)

  function handleReturn(error, stdout) {
    if (error) {
      process.stdout.write('.')
      setTimeout(checkMysql, 1000)
      return
    }

    // Para MySQL padrão
    if (stdout.includes('mysqld is alive')) {
      console.log('\n🟢 Mysql está pronto para aceitar conexões.\n')
    } else {
      process.stdout.write('.')
      setTimeout(checkMysql, 1000)
    }
  }
}

process.stdout.write('\n\n🔴 Aguardando o Mysql aceitar conexões.')
checkMysql()
