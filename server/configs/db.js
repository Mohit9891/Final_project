import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        
        mongoose.connection.once("connected", ()=>{
            console.log("Database connected succesfully")
        })

        let mongodbURI = process.env.MONGODB_URI;
        const projectName  = 'resume_builder';

        if(!mongodbURI){
            throw new Error("Mongodb uri enviroment variable not set");
        }
        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1)
        }
        await mongoose.connect(`${mongodbURI}/${projectName}`)
    } catch (error) {
        console.error("error connecting to mongodb" , error);
        
    
    }
}

export  default connectDB