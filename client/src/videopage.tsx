import { useRef, useState, useEffect } from "react";
import { FiMic, FiMicOff } from "react-icons/fi";
import { socket } from "./socket.js";
import { makeCall, handleOffer, handleAnswer, handleCandidate, hangup } from "./webrtcHelperFunc.js";
import { Button } from "./components/ui/button.js";

function VideoPage() {
  const startButton = useRef<HTMLButtonElement>(null);
  const hangupButton = useRef<HTMLButtonElement>(null);
  const muteAudButton = useRef<HTMLButtonElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const pc = useRef<RTCPeerConnection | null>(null);

  // Assign local stream to video element
  useEffect(() => {
    if (localVideo.current && localStream) {
      localVideo.current.srcObject = localStream;
    }
  }, [localStream]);

  // Socket handling
  useEffect(() => {
    const handleSocket = async (e: any) => {
      if (!pc.current) return;

      switch (e.type) {
        case "offer":
          await handleOffer(pc.current, e, localStream!, remoteVideo, setRemoteStream);
          break;
        case "answer":
          await handleAnswer(pc.current, e);
          break;
        case "candidate":
          await handleCandidate(pc.current, e.candidate);
          break;
        case "ready":
          if (pc.current) return;
          pc.current = new RTCPeerConnection();
          if (localStream) {
            await makeCall(pc.current, localStream, remoteVideo, setRemoteStream);
          }
          break;
        case "bye":
          hangupCall();
          break;
      }
    };

    socket.on("message", handleSocket);
  }, [localStream]);

  // Start call
  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);

    if (pc.current) return;
    pc.current = new RTCPeerConnection();

    if (startButton.current) startButton.current.disabled = true;
    if (hangupButton.current) hangupButton.current.disabled = false;
    if (muteAudButton.current) muteAudButton.current.disabled = false;

    socket.emit("message", { type: "ready" });
  };

  // Hangup
  const hangupCall = () => {
    if (pc.current) hangup(pc.current, localStream);
    pc.current = null;
    setLocalStream(null);
    setRemoteStream(null);

    if (startButton.current) startButton.current.disabled = false;
    if (hangupButton.current) hangupButton.current.disabled = true;
    if (muteAudButton.current) muteAudButton.current.disabled = true;

    socket.emit("message", { type: "bye" });
  };

  // Toggle audio
  const toggleAudio = () => {
    if (!localStream) return;
    const track = localStream.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setAudioEnabled(track.enabled);
  };

  return (
    <>
      <div className="video bg-main gap-2 w-min-full h-[75vh] flex border-black">
        <div className="grid grid-cols-2 gap-3 p-8 border-black h-full w-full">
          {localStream
            ? <video ref={localVideo} autoPlay playsInline className="video-item" />
            : <div className="bg-black h-full w-full" />}
          {remoteStream
            ? <video ref={remoteVideo} autoPlay playsInline className="video-item" />
            : <div className="bg-black h-full w-full" />}
        </div>
      </div>

      <div className="btn justify-center flex gap-6 mt-4">
        <Button ref={startButton} onClick={startCall} className="">Start</Button>
        <Button ref={hangupButton} onClick={hangupCall} className="">Hang Up</Button>
        <Button ref={muteAudButton} onClick={toggleAudio} className="">
          {audioEnabled ? <FiMic /> : <FiMicOff />}
        </Button>
      </div>
    </>
  );
}

export default VideoPage;
