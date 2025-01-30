import express, { Request, Response } from 'express'; 
import bcrypt from 'bcryptjs'
import User from './user.model'

const userRoutes = express.Router();

interface IUser { 
    Name: string;
    Username: string;
    Password: string;
}

userRoutes.post("/register", async (req: Request, res: Response) => {
    const { Name, Username, Password }: IUser = req.body;

    try {
        const user = await User.findOne({ Username });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = new User({
            Name,
            Username,
            Password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ message: "User registration failed", error: err });
    }
});

userRoutes.post("/authenticate-user", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const name = user.name;
        res.json({ message: "Successfully logged in", name });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err });
    }
});

export default userRoutes; 
