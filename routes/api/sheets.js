const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const auth = require("../middlewares/auth");
const Sheet = require("../../models/Sheet");

/*
route: [POST] /api/sheets/new
params: title, maxCols, theme, corners, borders
access: authenticated users
return: new sheet id
*/
router.post("/new", auth, (req, res) => {
  const { title, maxCols, theme, corners, defaultLang, borders } = req.body;

  const authorId = req.user._id;

  if (!title) {
    return res.status(400).json({ msg: "Sheet title is missing" });
  }
  User.findById(authorId).then((author) => {
    const newSheet = new Sheet({
      title,
      authorId,
      authorUsername: author.username,
      maxCols,
      defaultLang,
      theme,
      borders,
      corners,
      cells: [
        { id: 0, title: "", rows: [{ id: 0, value: "", lang: defaultLang }] },
      ],
      favorites: [],
    });

    newSheet
      .save()
      .then((sheet) => {
        res.json(sheet._id);
      })
      .catch(() => {
        res.status(400).json({ msg: "operation failed" });
      });
  });
});

/*
route: [PATCH] /api/sheets/toggle-favorites/:id
params: sheet id
access: authenticated users
return: sheet with the favorites field updated
*/
router.patch("/toggle-favorites/:id", auth, (req, res) => {
  const userId = req.user._id;
  Sheet.findById(req.params.id)
    .then((sheet) => {
      let favorites = sheet.favorites;
      if (favorites.includes(userId)) {
        favorites = favorites.filter((id) => id !== userId);
      } else {
        favorites.push(userId);
      }
      Sheet.findByIdAndUpdate(req.params.id, { favorites }, { new: true })
        .then((updatedSheet) => {
          res.json(updatedSheet);
        })
        .catch(() => {
          res.status(400).json({ msg: "opertaion failed" });
        });
    })
    .catch(() => {
      res.status(404).json({ msg: "Sheet not found" });
    });
});

/*
route: [PATCH] /api/sheets/:id
params: sheet id
access: private
return: updated sheet
*/
router.patch("/:id", auth, (req, res) => {
  const userId = req.user._id;
  Sheet.findById(req.params.id)
    .then((sheet) => {
      if (userId !== sheet.authorId) {
        res
          .status(401)
          .json({ msg: "You are not authorized to edit this sheet" });
      }
      let update = req.body;
      if (update.published) {
        update.publishedAt = new Date();
      }

      Sheet.findByIdAndUpdate(req.params.id, update, { new: true })
        .then((updatedSheet) => {
          res.json(updatedSheet);
        })
        .catch(() => {
          res.status(400).json({ msg: "opertaion failed" });
        });
    })
    .catch(() => {
      res.status(404).json({ msg: "Sheet not found" });
    });
});

/*
route: [GET] /api/sheets/nonpublished
params: user token (embedded in header)
access: authenticated users
return: list of non published sheets by the user
*/
router.get("/non-published", auth, (req, res) => {
  Sheet.find({ published: false, authorId: req.user._id })
    .sort("-createdAt")
    .then((sheets) => {
      res.json(sheets);
    })
    .catch(() => {
      res.status(400).json({ msg: "could not fetch sheets" });
    });
});

/*
route: [GET] /api/sheets/one-public-sheet/:id
params: sheet id
access: public
return: one sheet
*/
router.get("/one-public-sheet/:id", (req, res) => {
  Sheet.findOne({ _id: req.params.id, published: true })
    .then((sheet) => {
      if (sheet) {
        res.json(sheet);
      } else {
        res.status(404).json({ msg: "Sheet not found" });
      }
    })
    .catch(() => {
      res.status(400).json({ msg: "Sheet not found" });
    });
});

/*
route: [GET] /api/sheets/one-private-sheet/:id
params: sheet id and token (embedded in header)
access: private
return: one sheet
*/
router.get("/one-private-sheet/:id", auth, (req, res) => {
  Sheet.findOne({ _id: req.params.id })
    .then((sheet) => {
      if (sheet) {
        res.json(sheet);
      } else {
        res.status(404).json({ msg: "Sheet not found" });
      }
    })
    .catch(() => {
      res.status(400).json({ msg: "Sheet not found" });
    });
});

//Simple dictionary for sorting results when requested
const sortByOptions = {
  "most-recent": "-publishedAt",
  "most-popular": "-favorites",
};
/*
route: [GET] /api/sheets/
params: 
-byUserId (optional): When present, returns only sheet by this user
-favoredByUserId (optional), when present returns only sheet favored by this user
-onlyThereIsMore (optional), when present returns only a boolean indicationg whether or not there are more sheets on the server
-currentSheetIds: a list of sheet ids on the client
access: public
*/
router.get("/", (req, res) => {
  const byUserId = req.query.byUserId;
  const favoredByUserId = req.query.favoredByUserId;
  const onlyThereIsMore = req.query.onlyThereIsMore;
  let params = { published: true };
  if (byUserId) {
    params.authorId = byUserId;
  }
  if (favoredByUserId) {
    params.favorites = favoredByUserId;
  }

  Sheet.countDocuments(params, function (err, count) {
    const currentSheetIds = req.query.currentSheetIds || [];

    if (onlyThereIsMore) {
      res.json({
        thereIsMoreOnTheServer: count > currentSheetIds.length,
      });
    } else {
      const sortBy = req.query.sortBy || "most-recent";

      params._id = { $nin: currentSheetIds };

      Sheet.find(params)
        .sort(sortByOptions[sortBy])
        .limit(25)
        .then((sheets) => {
          res.json({
            thereIsMoreOnTheServer:
              count > sheets.length + currentSheetIds.length,
            sheets,
          });
        })
        .catch(() => {
          res.status(400).json({ msg: "could not fetch sheets" });
        });
    }
  });
});

/*
route: [DELTE] /api/sheets/:id
params: sheet id, user token (embedded in the header)
access: private
*/
router.delete("/:id", auth, (req, res) => {
  const userId = req.user._id;
  Sheet.findById(req.params.id)
    .then((sheet) => {
      if (userId !== sheet.authorId) {
        res
          .status(401)
          .json({ msg: "You are not authorized to delete this sheet" });
      }

      sheet
        .remove()
        .then(res.status(200).json({ msg: "Sheet successfuly deleted" }));
    })
    .catch((err) => {
      res.status(404).json({ msg: "Sheet not found" });
    });
});

module.exports = router;
