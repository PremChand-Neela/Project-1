import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Typeof.ObjectId,
        ref:"User"
    },
    channel:{
        type: Schema.Typeof.ObjectId,
        ref:"User"
    },
},{timestamps:true})


export const Subscription = mongoose.model("Subscription",subscriptionSchema);