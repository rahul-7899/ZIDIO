import User from '../models/User.js';
import Chart from '../models/Chart.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
};

export const getAllCharts = async (req, res) => {
  const charts = await Chart.find({}).populate('user', 'username');
  res.json(charts);
};