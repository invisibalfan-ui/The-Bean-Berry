const fetch = require('node-fetch')

exports.sendPush = async (token, title, body) => {
  if(!token) return

  await fetch('https://exp.host/--/api/v2/push/send', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({
      to: token,
      sound:'default',
      title,
      body
    })
  })
}