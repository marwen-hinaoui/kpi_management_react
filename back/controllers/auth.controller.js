const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { userKPI } = require("../models");
const generateToken = require("../middleware/generateToken");
const blacklistedRefreshTokens = new Set();
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await userKPI.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }
     
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }
  
    const token = generateToken(user);
       
    const refreshToken = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "7d" }
    );
       
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
        
    return res.status(200).json({
      id: user.id,
      username: user.username,
      accessToken: token,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    console.error("Erreur lors du login:", error);
    return res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};

const signUp = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
   
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      matricule: req.body.matricule,
      id_site: req.body.id_site,
      username: req.body.username,
      password: hashedPassword,
    };
     
    const user_create = await userKPI.create(user);

    return res.status(201).json({
      id: user_create.id,
      username: user_create.username,
      site: user_create.id_site,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET_KEY,
    async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });

      const user = await userKPI.findByPk(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const newAccessToken = jwt.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: 86400 }
      );

      res.status(200).json({
        id: user.id,
        accessToken: newAccessToken,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  );
};

const logout = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken && token) {
    blacklistedRefreshTokens.add(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
  }
  return res.status(200).json({ message: "Déconnecté, token blacklisté" });
};

module.exports = { logout, signUp, login, refreshAccessToken };
