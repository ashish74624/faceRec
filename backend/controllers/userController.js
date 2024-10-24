const User = require('../models/User');

// Register user and save face descriptor
const registerUser = async (req, res) => {
  const { name, email, password, faceDescriptor } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, faceDescriptor });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Compare face descriptor and mark attendance
const markAttendance = async (req, res) => {
  const { liveDescriptor } = req.body;

  try {
    const users = await User.find({});
    let foundUser = null;

    users.forEach(user => {
      const distance = faceapi.euclideanDistance(user.faceDescriptor, liveDescriptor);
      if (distance < 0.6) { // threshold for match
        foundUser = user;
      }
    });

    if (foundUser) {
      foundUser.attendance.push({ date: Date.now() });
      await foundUser.save();
      res.json({ message: 'Attendance marked', user: foundUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser, markAttendance };
