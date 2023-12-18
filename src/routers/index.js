import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.render(
      "/home/by1094/testRepo/src/public/main.ejs",
      function (err, html) {
        res.send(html);
      },
    );
  } catch (e) {
    console.log(e);
  }
});

export default router;
