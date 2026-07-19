import { useEffect, useState } from "react";
import { socket } from "../services/socket";

export function useAlertsSocket(max = 50) {
  const [liveAlerts, setLiveAlerts] = useState([]);

  useEffect(() => {
    function onAlert(alert) {
      setLiveAlerts((prev) => [alert, ...prev].slice(0, max));
    }
    socket.on("alert:new", onAlert);
    return () => socket.off("alert:new", onAlert);
  }, [max]);

  return liveAlerts;
}
