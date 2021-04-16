import initDB from '../../helpers/initDB';

initDB();

export default (req, res) => {
  res.status(200).json({ name: 'John Doe' })
}
