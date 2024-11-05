import axios from 'axios';
import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { apiUrl, socketUrl } from './utils';

type Stage = "focus" | "break" | "none";

const App = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<{ timeElapsed: number; currentStage: Stage } | null>(null);
  const [timeLabel, setTimeLabel] = useState<string>("00:00");
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const stageLabel: Record<Stage, string> = {
    "focus": "Focando",
    "break": "Descançando",
    "none": "Fazendo Nada",
  };

  const timeMap = {
    focus: 50 * 60,
    break: 5 * 60,
    none: 0
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(apiUrl + "/status");
      setStatus({ ...response.data });
      setIsPaused(response.data.isPaused);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;

      setStatus(prev => (prev ?
        { ...prev, timeElapsed: prev.timeElapsed + 1 } :
        { timeElapsed: 0, currentStage: "none" }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    setProgress(getProgress());
    const minutes = Math.floor(getTimeRemaining() / 60);
    const seconds = getTimeRemaining() % 60 % 60;
    setTimeLabel(formatTime(minutes, seconds));
  }, [status]);

  const getProgress = () => {
    if (!status?.timeElapsed || !status.currentStage) return 0;

    let totalTime = timeMap[status.currentStage];

    const newProgress = Math.min((status.timeElapsed / totalTime) * 100, 100);
    return newProgress;
  }

  const getTimeRemaining = () => {
    if (!status || status.currentStage === "none") return 0;
    const timeLimit = timeMap[status.currentStage];
    return Math.max(timeLimit - status.timeElapsed, 0);
  }

  const formatTime = (minutes: number, seconds: number) => {
    let formattedMinutes = minutes.toString();
    if (minutes < 10) {
      formattedMinutes = `0${minutes}`;
    }

    let formattedSeconds = seconds.toString();
    if (seconds < 10) {
      formattedSeconds = `0${seconds}`;
    }

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const { lastMessage } = useWebSocket(socketUrl)

  useEffect(() => {
    if (!lastMessage?.data) return;

    switch (lastMessage.data) {
      case "focus":
        setStatus({ timeElapsed: 0, currentStage: "focus" });
        break;
      case "reset":
        setStatus({ timeElapsed: 0, currentStage: "none" });
        break;
      case "break":
        setStatus({ timeElapsed: 0, currentStage: "break" });
        break;
      case "pause":
        setIsPaused(true);
        break;
      case "resume":
        setIsPaused(false);
        break;
    }
  }, [lastMessage]);

  return (
    <div className="w-screen h-screen bg-dark-purple flex items-center justify-center overflow-hidden relative">
      <main className="text-white text-5xl font-jaro flex flex-col items-center gap-20">
        <h1 className="text-shadow">
          {status?.currentStage ? (
            `${stageLabel[status.currentStage]}`
          ) : (
            "Carregando"
          )}
        </h1>

        <div className="h-72 w-72 bg-purple rounded-full shadow-2xl flex items-center justify-center">
          <svg className="h-64 w-64" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#FFC0CB"
              strokeWidth="10"
              className="text-pink"
              strokeDasharray="282.6"
              strokeDashoffset={282.6 - (282.6 * progress) / 100}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#4A306D"
              strokeWidth="10"
              className="text-purple opacity-20"
            />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fill="white"
              fontSize="20"
              fontWeight="bold"
            >
              {status?.timeElapsed ? (
                <>
                  {timeLabel}
                </>
              ) : (
                "00:00"
              )}
            </text>
          </svg>
        </div>
      </main>

      <div className="absolute top-[-1400px] w-[1500px] h-[1500px] bg-[#544374] rounded-full" />
      <div className="absolute bottom-[-1400px] w-[1500px] h-[1500px] bg-[#544374] rounded-full" />
    </div>
  );
};

export default App;
