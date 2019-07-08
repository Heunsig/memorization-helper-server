const app = require('./app')
const User = require('./models/user')
const auth = require('./middleware/auth')
const port = process.env.PORT || 3000

app.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }

})

app.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()

    res.send({ user, token })
  } catch (e) {
    res.status(400).send()
  } 
})

app.post('/users/logut', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save()
  } catch (e) {
    res.status(500).send()
  }
})

app.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

app.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

app.get('/users/me/words', auth, async (req, res) => {
  res.send(req.user.words)
})

app.post('/users/me/words', auth, async (req, res) => {
  try {
    var word = req.user.words.create({
      word: req.body.word,
      pos: req.body.pos,
    })

    word.clues.push(...req.body.clues)
    req.user.words.push(word)
    await req.user.save()
    res.status(201).send(word)
  } catch (e) {
    res.status(400).send()
  }
})

app.delete('/users/me/words/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const word = req.user.words.id(_id)
    if (!word) {
      return res.status(404).send()
    }

    word.remove()
    await req.user.save()

    res.send(word)
    } catch (e) {
      res.status(500).send()
  }
})

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})