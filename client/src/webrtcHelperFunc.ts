import { socket } from "./socket.js";

const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
  ],
  iceCandidatePoolSize: 10,
};

export async function makeCall(pc: RTCPeerConnection, localStream: MediaStream, remoteVideo: React.RefObject<HTMLVideoElement | null>, setRemoteStream: Function) {
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.onicecandidate = e => {
    if (e.candidate) socket.emit("message", { type: "candidate", candidate: e.candidate });
  };

  pc.ontrack = e => {
    setRemoteStream(e.streams[0]);
    if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit("message", { type: "offer", sdp: offer.sdp });
}

export async function handleOffer(pc: RTCPeerConnection, offer: any, localStream: MediaStream, remoteVideo: React.RefObject<HTMLVideoElement | null>, setRemoteStream: Function) {
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.onicecandidate = e => {
    if (e.candidate) socket.emit("message", { type: "candidate", candidate: e.candidate });
  };

  pc.ontrack = e => {
    setRemoteStream(e.streams[0]);
    if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0];
  };

  await pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit("message", { type: "answer", sdp: answer.sdp });
}

export async function handleAnswer(pc: RTCPeerConnection, answer: any) {
  if (!pc) return;
  await pc.setRemoteDescription(new RTCSessionDescription(answer));
}

export async function handleCandidate(pc: RTCPeerConnection, candidate: any) {
  if (!pc || !candidate) return;
  await pc.addIceCandidate(new RTCIceCandidate(candidate));
}

export function hangup(pc: RTCPeerConnection | null, localStream: MediaStream | null) {
  if (pc) pc.close();
  localStream?.getTracks().forEach(track => track.stop());
}
