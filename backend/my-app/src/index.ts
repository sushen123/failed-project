import { Hono } from 'hono'
import { cors } from 'hono/cors'


const app = new Hono()

app.use("/*", cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/text', (c) => {
  
  return c.json({
    success: false,
    message: "Heelo"
  })
})


export default app
