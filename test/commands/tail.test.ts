import {expect, test} from '@oclif/test'

describe('tail', () => {
  test
    .stdout()
    .command(['tail'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['tail', '--name', 'jeff'])
    .it('runs hello --name jeff', (ctx) => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
