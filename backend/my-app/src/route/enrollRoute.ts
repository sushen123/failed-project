import { PrismaClient } from "@prisma/client/edge"
import { Hono } from "hono"
import { withAccelerate } from "@prisma/extension-accelerate"



const enrollRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        CLOUD_SECRET_KEY: string,
        CLOUD_API_KEY: string,
        CLOUD_NAME: string
    }
}>()

enrollRouter.post("/:courseId/enroll", async(c) => {

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const courseId = c.req.param('courseId')
    const userId =  c.req.header("userId") || ""

    try {
        const enrollement = await prisma.enrollment.create({
            data: {
                userId: userId,
                courseId: parseInt(courseId)
            }
        })

      return  c.json({
            success: true,
            message: "User enrolled",
            enrollement
        },200)
    } catch (error) {
        
        return c.json({
            success: false,
            message: "Failed to enroll in course"
        })
    }

  
    })



    enrollRouter.post("/", async(c) => {

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
    
       
        const userId =  c.req.header("userId") || ""
    
        try {
          const enrollements = await prisma.enrollment.findMany({
            where: {
                userId: userId
            },
            include: {
                course: true
            }
          })
    
          return  c.json({
                success: true,
                enrollements
            },200)
        } catch (error) {
            
            return c.json({
                success: false,
                message: "Failed to get enrollements"
            })
        }
    
      
        })
    
        

        enrollRouter.post("/:courseId/enrollments", async(c) => {

            const prisma = new PrismaClient({
                datasourceUrl: c.env.DATABASE_URL
            }).$extends(withAccelerate())
        
            const courseId = c.req.param('courseId')
             
        
            try {
                const enrollement = await prisma.enrollment.findMany({
                    where: {
                        courseId: parseInt(courseId),
                        
                    },
                    include: {
                        user: true
                    }
                })
        
              return  c.json({
                    success: true,
               
                    enrollement
                },200)
            } catch (error) {
                
                return c.json({
                    success: false,
                    message: "Failed to get enrollements"
                })
            }
        
          
            })
        
            
        