async function createMonsters() {
  const result = await fetch('http://localhost:3333/api/monsters', {
    accept: 'application/json',
    method: 'PUT'
  })

  return result.json()
}

createMonsters()
  .then((result) => console.log(result.message))
  .catch(console.error)
