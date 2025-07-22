export default function (req, res) {
  res.status(404).json({ message: "404 Page is not founded!" });
}
