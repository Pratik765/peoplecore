import { useEffect, useState } from "react";

const useFetch = (url, initialState = []) => {
  const [state, setState] = useState({ users: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      async function loadData() {
        setLoading(true);
        const data = await fetch(url, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        if (!data.ok) {
          throw new Error("Failed to fetch data");
        }
        const res = await data.json();
        setState(res);
      }
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);
  return { state, error, loading };
};
export default useFetch;
