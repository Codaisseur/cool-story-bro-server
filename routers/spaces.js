const { Router } = require("express");
const auth = require("../auth/middleware");
const Space = require("../models").space;
const Story = require("../models").story;

const router = new Router();

// PATCH - update space details
router.patch("/:id", auth, async (req, res) => {
  const space = await Space.findByPk(req.params.id);
  if (!space.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this space" });
  }

  const { title, description, backgroundColor, color } = req.body;

  await space.update({ title, description, backgroundColor, color });

  return res.status(200).send({ space });
});

// POST a new story to space with corresponding `id`
router.post("/:id/stories", auth, async (req, res) => {
  const space = await Space.findByPk(req.params.id);
  console.log(space);

  if (space === null) {
    return res.status(404).send({ message: "This space does not exist" });
  }

  if (!space.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this space" });
  }

  const { name, imageUrl, content } = req.body;

  if (!name) {
    return res.status(400).send({ message: "A story must have a name" });
  }

  const story = await Story.create({
    name,
    imageUrl,
    content,
    spaceId: space.id,
  });

  return res.status(201).send({ message: "Story created", story });
});

// Get all spaces
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

// GET space with stories by id.
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
  try {
    const { id } = req.params;
    const storyToDelete = await Story.findByPk(id);

    if (!storyToDelete) return res.status(404).send("no story found");

    await storyToDelete.destroy();

    // look at delete status
    // should we send something?
    res.send({ message: "story deleted!" });
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
