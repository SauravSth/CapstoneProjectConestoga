import User from '../models/userModel.js';

// Import Error Handler
import errorHandler from '../helpers/errorHandler.js';

const userController = {
  testRoute: async (req, res) => {
    res.send(req.user);
  },
  sendemail: async (req, res) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for port 465, false for other ports blah
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = await transporter.sendMail({
      from: {
        name: 'PerCent Team',
        address: process.env.USER,
      },
      to: 'piyush.mdhr@gmail.com',
      subject: 'Oe MongoURL change garis?',
      text: 'Oe MongoURL change garis?',
      html: '<h1>Oe MongoURL change garis?</h1>',
    });
    const sendMail = async (transporter, mailOptions) => {
      try {
        await transporter.sendMail(mailOptions);
        console.log('Mail Sent');
      } catch (e) {
        console.log(e);
      }
    };

    sendMail(transporter, mailOptions);
  },
  getUser: async (req, res) => {
    try {
      const users = await User.find({});

      res.status(200).json({ users });
    } catch (e) {
      console.log(e);
    }
  },
  getOneUser: async (req, res) => {
    try {
      const uid = req.user.uid;

      const user = await User.findOne({ _id: uid });

      res.status(200).json({ user });
    } catch (e) {
      console.log(e);
    }
  },
  updateUser: async (req, res) => {
    try {
      const { _id, username, firstName, lastName, email, password } = req.body;

      const updatedData = await User.findOneAndUpdate(
        { _id },
        { $set: { username, firstName, lastName, email, password } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'User Updated',
        updatedData,
      });
    } catch (e) {
      const errors = errorHandler.handleUserErrors(e);
      res.status(400).json(errors);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { _id } = req.body;

      const deletedData = await User.findOneAndUpdate(
        { _id },
        { $set: { isActive: false } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'User Deleted',
        deletedData,
      });
    } catch (e) {
      console.log(e.message);
    }
  },
};

export default userController;
