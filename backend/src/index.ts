import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { userModel } from "./db";
import dbConnection from "./db-server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
const port = 3000;
const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const requiredBody = z.object({
    username: z.string().min(4).max(50),
    email: z.string().email(),
    password: z
      .string()
      .min(5)
      .max(40)
      .regex(/[A-Z]/, "password must contain upper case letter")
      .regex(/[a-z]/, "password must contain lower case letter")
      .regex(
        /[!@#$%^&*()_<>?:]/,
        "password must contain any special character"
      ),
  });

  const parsedData = requiredBody.safeParse(req.body);
  if (!parsedData) {
    res.json({
      message: "validation error",
    });
    return;
  }

  const { username, password, email } = req.body;

  const hashedpassword = await bcrypt.hash(password, 5);

  try {
    // also need to store email
    await userModel.create({
      username,
      password: hashedpassword,
    });
  } catch (err) {
    res.json({
      message: "user already exists!",
    });
  }
  res.status(403).json({
    message: "you are signed up",
  });
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  const findUser = await userModel.findOne({
    username,
  });
  if (findUser && findUser.password) {
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: findUser._id.toString(),
        },
        JWT_SECRET
      );
      res.status(403).json({
        token,
      });
    } else {
      res.json({
        message: "incorrect password",
      });
    }
  } else {
    res.status(404).json({
      message: "user not signed up",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {});
app.get("/ap/v1i/content", (req, res) => {});
app.delete("/api/v1/content", (req, res) => {});
app.post("/api/v1/sharelink", (req, res) => {});

dbConnection();

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
