import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        
        mongoose.connection.once("connected", ()=>{
            console.log("Database connected succesfully" , mongoose.connection.name)
        })

        let mongodbURI = process.env.MONGODB_URI;
        const projectName  = 'resume_builder';

        if(!mongodbURI){
            throw new Error("Mongodb uri enviroment variable not set");
        }

        // Insert the database name into the URI path BEFORE the query string.
        // Naively appending "/name" to a URI that has "?w=majority" produces
        // "?w=majority/name", which MongoDB rejects as an unknown write concern.
        const [base, query] = mongodbURI.split("?");
        const trimmed = base.replace(/\/+$/, "");
        const withoutScheme = trimmed.replace(/^mongodb(\+srv)?:\/\//, "");
        const hasDbName = withoutScheme.includes("/");
        const withDb = hasDbName ? trimmed : `${trimmed}/${projectName}`;

        await mongoose.connect(query ? `${withDb}?${query}` : withDb)
    } catch (error) {
        console.error("error connecting to mongodb" , error);
        throw error;
    }
}

export  default connectDB