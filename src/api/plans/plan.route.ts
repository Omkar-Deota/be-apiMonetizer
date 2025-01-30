import express, { Request, Response } from 'express'; 
import PricingOption from './plan.models'
const subscriptionRoute = express.Router();


subscriptionRoute.get("/pricing-options", async (req: Request, res: Response) => {
    try {
      const pricingOptions = await PricingOption.find({});
      res.json(pricingOptions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching pricing options", error });
    }
  });

  export default subscriptionRoute;
  