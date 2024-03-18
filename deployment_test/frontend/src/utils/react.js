import { useState, useEffect } from 'react';

//custom hook that returns data when the data the query relies on changes
function useSubscribe(reflect, query, initial) {
  // State to store the key value pair
  const [data, setData] = useState(null);

  //runs when the component is rendered initially or the reflect / query objects change  
  useEffect(() => {
    // Subscribe to data using the provided reflect subscription manager
    const unsubscribe = reflect.subscribe(query, newData => { setData(newData) });

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [reflect, query]);

  //if data is still null, then return the default value
  if (data === null) {
    return initial;
  }

  //otherwise return the data
  return data;
}

export { useSubscribe };