import {execa} from 'execa'

const checkLogin = async () => {
  const {stdout} = await execa('wrangler', ['whoami'])
  const email = String(stdout.match(/\w+@.+[^!]/))
  const loginStatus = stdout.includes('You are logged in with the email')

  return {loginStatus, email}
}
export default checkLogin
