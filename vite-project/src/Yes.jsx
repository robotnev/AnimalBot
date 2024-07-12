import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import getData from './options';
import Taskbar from './Taskbar';

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
      <Taskbar />
    </div>
  );
}

export default Yes;
