const externalService = require('../services/external_service');

exports.aggregate = async (req, res) => {
  try {
    const data = await externalService.getAggregated();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
};
