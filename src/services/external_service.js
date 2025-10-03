exports.getAggregated = async () => {
  // usa fetch global (node v18+). Si no está, instala node-fetch.
  const urls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://api.exchangerate.host/latest?base=USD&symbols=MXN,EUR'
  ];

  const [r1, r2] = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));
  return { post: r1, rates: r2 };
};
