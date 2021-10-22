const { Router } = require("express");
const Space = require("../models").space;
const Story = require("../models").story;
const authMiddleware = require("../auth/middleware");

const router = new Router();

router.get("/", async (req, res) => {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const spaces = await Space.findAndCountAll({
    limit,
    offset,
    include: [Story],
    order: [[Story, "createdAt", "DESC"]],
  });
  res.status(200).send({ message: "ok", spaces });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);
  if (isNaN(parseInt(id))) {
    return res.status(400).send({ message: "Space id is not a number" });
  }

  const space = await Space.findByPk(id, {
    include: [Story],
    order: [[Story, "createdAt", "DESC"]],
  });

  if (space === null) {
    return res.status(404).send({ message: "Space not found" });
  }

  res.status(200).send({ message: "ok", space });
});

router.delete("/story/:id", async (req, res, next) => {
  // DELETE = /story/2
  try {
    const id = req.params.id;

    const story = await Story.findByPk(id);

    await story.destroy();

    res.send({ message: "success", storyId: id });
  } catch (e) {
    next(e);
  }
});

router.post("/story", authMiddleware, async (req, res, next) => {
  try {
    const { title, content, spaceId } = req.body;
    // console.log("creating a story", { title, content, spaceId });
    const story = await Story.create({ name: title, content, spaceId }); // spaceId
    res.send(story);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
