const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Fetch profile
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

// Update profile
const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name  = req.body.name  || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        await user.save();

        // Return without password
        const updated = await User.findById(user._id).select("-password");
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

// Change password
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: "Password changed" });
    } catch (error) {
        next(error);
    }
};

// 2FA settings
const update2FA = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        user.twoFactorEnabled = req.body.enabled;

        await user.save();

        res.json({ twoFactorEnabled: user.twoFactorEnabled });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    update2FA
};
