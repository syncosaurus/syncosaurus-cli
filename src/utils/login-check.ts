import {execa} from 'execa'

const checkLogin = async () => {
  const {stdout} = await execa('wrangler', ['whoami'], {shell: true})
  const loginStatus = stdout.includes('You are logged in')
  let email
  if (loginStatus) {
    email = String(stdout.match(/\w+@.+[^!]/))
  }

  return {loginStatus, email}
}
export default checkLogin
