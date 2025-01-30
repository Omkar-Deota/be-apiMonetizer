import mongoose, {Schema} from "mongoose";
interface IPricingOption extends Document {
    title: string;
    price: string;
    features: string[];
  }
  
const pricingOptionSchema = new Schema<IPricingOption>({
    title: { type: String, required: true },
    price: { type: String, required: true },
    features: { type: [String], required: true },
  });
  
export default mongoose.model<IPricingOption>("PricingOption", pricingOptionSchema);
  