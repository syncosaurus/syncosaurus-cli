import {expect, test} from '@oclif/test'

describe('loginUser.ts', () => {
  test
    .stdout()
    .command(['loginUser.ts'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['loginUser.ts', '--name', 'jeff'])
    .it('runs hello --name jeff', (ctx) => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
