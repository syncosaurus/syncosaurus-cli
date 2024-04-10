// Define your mutators here in ./src/mutators.js
export default {
  increment,
  decrement,
}

// Mutator functions take 'tx' as their first parameter, and an user-defined object as their second parameter
async function increment(tx, {key, delta}) {
  const prev = tx.get(key)
  const next = (prev ?? 0) + delta
  tx.set(key, next)
}

async function decrement(tx, {key, delta}) {
  const prev = tx.get(key)
  const next = (prev ?? 0) - delta
  tx.set(key, next)
}
