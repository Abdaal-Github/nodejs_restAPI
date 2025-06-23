const User = require("../model/User");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  //delete RefreshToken on client-side
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); // Successful but no content
  }
  //Delete Refresh Token in DB
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" /*secure: true*/ });
  res.sendStatus(204);
};

module.exports = { handleLogout };
