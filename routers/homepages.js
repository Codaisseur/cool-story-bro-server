const { Router } = require("express");
const auth = require("../auth/middleware");
const Homepage = require("../models").homepage;
const Story = require("../models").story;

const router = new Router();

router.patch("/:id", auth, async (req, res) => {
  const homepage = await Homepage.findByPk(req.params.id);
  if (!homepage.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { title, description, backgroundColor, color } = req.body;

  await homepage.update({ title, description, backgroundColor, color });

  return res.status(200).send({ homepage });
});

router.post("/:id/stories", auth, async (req, res) => {
  const homepage = await Homepage.findByPk(req.params.id);
  console.log(homepage);

  if (homepage === null) {
    return res.status(404).send({ message: "This homepage does not exist" });
  }

  if (!homepage.userId === req.user.id) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this homepage" });
  }

  const { name, imageUrl, content } = req.body;

  if (!name) {
    return res.status(400).send({ message: "A story must have a name" });
  }

  const story = await Story.create({
    name,
    imageUrl,
    content,
    homepageId: homepage.id
  });

  return res.status(201).send({ message: "Story created", story });
});

module.exports = router;
