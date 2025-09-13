

// Callback after Google OAuth
export const googleCallback = (req, res) => {
  res.redirect("http://localhost:3000/dashboard");
};

// Logout user
export const logoutUser = (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: "Logged out" });
  });
};

// Get current logged-in user
export const getMe = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
};

// Example protected route
export const getDashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user.name} to your dashboard!` });
};
