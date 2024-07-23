
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { use } from "hono/jsx";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcryptjs'

const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        CLOUD_SECRET_KEY: string,
        CLOUD_API_KEY: string,
        CLOUD_NAME: string
    }
}>()

userRouter.get("/:id", async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())


    const {id} = c.req.param()
    const user = await prisma.user.findUnique({where: {id}})
    return c.json({
        success: true,
        user
    })
})


userRouter.put("/update/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const {id} = c.req.param()
    const username = await c.req.json()

    const user = await prisma.user.update({where: {id}, data: {username}})

    if(!user) {
        return c.json({
            success: false,
            message: "User not found"
        },404)
    }
    return c.json({
        success: true,
        message: "Updated Successfully"
    },200)
})

userRouter.put("/updateName/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const {id} = c.req.param()
    const name = await c.req.json()

    const user = await prisma.user.update({where: {id}, data: {name}})

    if(!user) {
        return c.json({
            success: false,
            message: "User not found"
        },404)
    }
    return c.json({
        success: true,
        message: "Updated Successfully"
    },200)
})

userRouter.delete('/delete/:id', async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())


  try {
    
    const { id } = c.req.param();
    await prisma.user.delete({ where: { id } });
    return c.json({ success: true });
  } catch (error) {
        return c.json({
            success: false,
            message: error
        })
  }
  });


  userRouter.put("/updatePassword/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const {id} = c.req.param()
    const {oldPassword, newPassword}= await c.req.json()

   const user = await prisma.user.findFirst({
    where: {
        
    }
   })

    if(!user) {
        return c.json({
            success: false,
            message: "User not found"
        },404)
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)

    if(!isPasswordMatch) {

        return c.json({
            success: false,
            message: "Invalid Password"
        })
    }

    await prisma.user.update({
        where: {
            id: id
        }, data: {
            password: newPassword
        }
    })

    return c.json({
        success: true,
        message: "Updated Successfully"
    },200)
})