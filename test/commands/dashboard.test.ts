import {expect, test} from '@oclif/test'

describe('dashboard', () => {
  test
    .stdout()
    .command(['dashboard'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['dashboard', '--name', 'jeff'])
    .it('runs hello --name jeff', (ctx) => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
