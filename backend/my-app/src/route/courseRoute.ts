import { PrismaClient } from "@prisma/client/edge"
import { Hono } from "hono"
import { withAccelerate } from "@prisma/extension-accelerate"



const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        CLOUD_SECRET_KEY: string,
        CLOUD_API_KEY: string,
        CLOUD_NAME: string
    }
}>()

userRouter.post("/create", async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const course = await prisma.user.create({
        data: body,
        include: {
            
        }
    })

    return c.json({
        success: true,
        course
    })
    })




   
    userRouter.get("/:id", async(c) => {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const id = await c.req.param('id')
        try {
            const course = await prisma.course.findFirst({
                where: {
                    id: parseInt(id)
                },
                include: {
                    courseData: {
                        select: {
                            id: true,
                            videoLength: true,
                            VideoThumbnail: true,
                            videoSection: true,
                            
                        }
                    }
                }
                
                
            })

            return c.json({
                success: true,
                course
            })
        } catch (error) {
            
        }
    })

    userRouter.get("/bulk", async(c) => {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())


        const course = await prisma.course.findMany({
         
            include: {
                courseData: {
                    select: {
                        id: true,
                        videoLength: true,
                        VideoThumbnail: true,
                        videoSection: true,
                        
                    }
                }
            }
            
            
        })

        return c.json({
            success: true,
            course
        })
        
    })

//only for valid user
    userRouter.get("validuser/:id", async(c) => {

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const coursId = c.req.param('id')
        const userId = c.req.header("id")

    
        try {
            const courseList =  await prisma.course.findFirst({
                where: {
                    id: parseInt(coursId),
                    userId: userId
                }
            })

            if(!courseList) {
                return c.json({
                    success: false,
                    message: "You are not eligible to access this course"
                })
            }
            
            const content = courseList.content

         return   c.json({
                success: true,
                content
            })
        } catch (error) {
              return c.json({
                success: true,
                message: error
              })  
        }

        
    })



