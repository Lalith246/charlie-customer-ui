import { useEffect, useState, useRef } from "react";

const useWebSocket = (url: string) => {
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    ws.current = new WebSocket(url);
    ws.current.binaryType = "arraybuffer";

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
      startRecording();
    };

    ws.current.onmessage = (event) => {
      playAudio(event.data);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
      stopRecording();
    };
  };

  const disconnect = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
      console.log("WebSocket connection closed.");
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (event) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(event.data);
      }
    };
    mediaRecorder.current.start(500); // Send data every 500ms
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  };

  const playAudio = (audioData: ArrayBuffer) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }

    audioContext.current.decodeAudioData(audioData, (buffer) => {
      const source = audioContext.current!.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.current!.destination);
      source.start();
    });
  };

  return { connect, disconnect };
};

export default useWebSocket;
