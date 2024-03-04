const User = require('../models/user_model');

module.exports = {

    // Update User
    updateUser: async (req, res) => {
        try {
            const user = await User.findOne(
                { email: req.user.email }
            )
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                $set: req.body
            }, { new: true });

            if (!user) {
                return res.status(404).json('User not found');
            }

            const { password, __v, createdAt, updatedAt, ...others } = updatedUser._doc;
            res.status(200).json(others);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // Get User
    getUser: async (req, res) => {
        try {
            const user = await User.findOne(
                { email: req.user.email }
            ).populate("borrowedBooks reservedBooks");

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }


            const { password, __v, ...others } = user._doc;
            res.status(200).json(others);
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // search User by name or PSID
    SearchUserByNameOrPSID: async (req, res) => {
        try {
            let { searchTerm } = req.query; // Assuming searchTerm is passed as a query parameter

            // If the searchTerm contains a space, split it into first name and last name
            let firstName = '';
            let lastName = '';
            if (searchTerm.includes(' ')) {
                const searchTerms = searchTerm.split(' ');
                firstName = searchTerms[0];
                lastName = searchTerms.slice(1).join(' ');
            } else {
                firstName = searchTerm;
            }

            // Find user by either firstName, lastName, or PSID
            let users;
            if (lastName === '') {
                users = await User.find({
                    $or: [
                        { firstName: { $regex: new RegExp(firstName, "i") } },
                        { PSID: firstName }
                    ]
                }).populate("borrowedBooks reservedBooks");
            } else {
                users = await User.find({
                    $or: [
                        { firstName: { $regex: new RegExp(firstName, "i") } },
                        { lastName: { $regex: new RegExp(lastName, "i") } },
                        { PSID: searchTerm }
                    ]
                }).populate("borrowedBooks reservedBooks");
            }

            if (users.length === 0) {
                return res.send([]);
            }

            // Exclude sensitive data like password and version number from response
            const sanitizedUsers = users.map(user => {
                const { password, __v, ...others } = user._doc;
                return others;
            });

            res.status(200).json(sanitizedUsers);
        } catch (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    

    // Delete Users
    deleteUser: async (req, res) => {
        try {
            var user = await User.findOne({ email: req.user.email })
            await User.findByIdAndDelete(user._id);
            res.status(200).json("Account Successfully Deleted!")

        } catch (error) {
            res.status(500).json(error);
        }

    }



}

