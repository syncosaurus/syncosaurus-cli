export const mutators = {
  increment,
  decrement
};

//Mutators are async in replicache for startup: https://doc.replicache.dev/tutorial/adding-mutators
//2nd arg should look like {key: 'count', delta: 1}
async function increment(tx, { key, delta }) {
  const prev = tx.get(key);
  const next = (prev ?? 0) + delta;
  tx.set(key, next);
}

async function decrement(tx, { key, delta }) {
  console.log(`decrementing ${key} by ${delta}`);
  const prev = tx.get(key);
  const next = (prev ?? 0) - delta;
  tx.set(key, next);
}