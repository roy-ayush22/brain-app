import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { userModel } from "./db";
import dbConnection from "./db-server";
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

  const { username, password } = req.body;

  const hashedpassword = await bcrypt.hash(password, 5);

  try {
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

app.post("/api/v1/signin", (req, res) => {});
app.post("/api/v1/content", (req, res) => {});
app.get("/ap/v1i/content", (req, res) => {});
app.delete("/api/v1/content", (req, res) => {});
app.post("/api/v1/sharelink", (req, res) => {});

dbConnection();

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
