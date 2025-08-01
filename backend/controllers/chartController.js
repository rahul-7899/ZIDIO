import Chart from '../models/Chart.js';

export const saveChart = async (req, res) => {
  try {
    const { chartType, title, fields, data } = req.body;
    const chart = new Chart({
      user: req.user.id,
      chartType,
      title,
      fields,
      data
    });
    await chart.save();
    res.status(201).json(chart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserCharts = async (req, res) => {
  try {
    const charts = await Chart.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(charts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};