const Note = require("../models/noteModel");
const { Op } = require("sequelize");

exports.create = async (req, res) => {
  try {
    if (req.body.title === "") req.body.title = "Untitled";
    if (req.body.content === "") req.body.content = "Add text here";

    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.search = async (req, res) => {
  const search = req.query.q;
  try {
    const note = await Note.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } },
        ],
      },
    });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const note = await Note.findAll();
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllByUserId = async (req, res) => {
  const userId = req.user.id;
  try {
    const note = await Note.findAll({ where: { userId: userId } });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getOne = async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findOne({ where: { id: noteId } });
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  try {
    if (title === "") req.body.title = "Untitled";
    if (content === "") req.body.description = "Add text here";

    await Note.update(
      {
        title: title,
        content: content,
      },
      { where: { id: noteId } }
    );

    const note = await Note.findOne({ where: { id: noteId } });

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  const { noteId } = req.params;
  try {
    await Note.destroy({ where: { id: noteId } });

    res.status(200).json("deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

// exports.updatePosition = async (req, res) => {
//   const { boards } = req.body;
//   try {
//     for (const key in boards.reverse()) {
//       const board = boards[key];
//       await Board.findByIdAndUpdate(board.id, { $set: { position: key } });
//     }
//     res.status(200).json("updated");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.getFavourites = async (req, res) => {
//   try {
//     const favourites = await Board.find({
//       user: req.user._id,
//       favourite: true,
//     }).sort("-favouritePosition");
//     res.status(200).json(favourites);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };

// exports.updateFavouritePosition = async (req, res) => {
//   const { boards } = req.body;
//   try {
//     for (const key in boards.reverse()) {
//       const board = boards[key];
//       await Board.findByIdAndUpdate(board.id, {
//         $set: { favouritePosition: key },
//       });
//     }
//     res.status(200).json("updated");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
