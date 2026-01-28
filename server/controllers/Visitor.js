// controllers/visitor.js
const Visitor = require("../models/Visitor");
const Flat = require("../models/Flat");

exports.createVisitorEntry = async (req, res) => {
  try {
    const { name, mobile, purpose, flatId } = req.body;

    if (!name || !mobile || !purpose || !flatId) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const flat = await Flat.findById(flatId);
    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found",
      });
    }

    const visitor = await Visitor.create({
      name,
      mobile,
      purpose,
      flat: flatId,
      enteredBy: req.user.id, // SECURITY
    });

    res.status(201).json({
      success: true,
      message: "Visitor entry recorded",
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create visitor entry",
    });
  }
};

exports.markVisitorExit = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findById(id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status === "OUT") {
      return res.status(400).json({
        success: false,
        message: "Visitor already exited",
      });
    }

    visitor.status = "OUT";
    visitor.exitTime = new Date();
    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor exit marked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark exit",
    });
  }
};
// optional 
// exports.getMyFlatVisitors = async (req, res) => {
//   try {
//     if (!req.user.flat) {
//       return res.status(403).json({
//         success: false,
//         message: "Flat not assigned",
//       });
//     }

//     const visitors = await Visitor.find({ flat: req.user.flat })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: visitors,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch visitors",
//     });
//   }
// };