import { db } from "../prisma/db.ts";

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await db.orm.public.user.create({
    username,
    email,
    password,
  });
  return res.status(200).json(user);
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await db.orm.public.user.findUnique({
    where: {
      username: username,
    },
  });

  console.log(user)
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
};

export { register, login };
