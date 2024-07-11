import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import getData from './options';

function Yes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {data.forEach((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

export default Yes;
