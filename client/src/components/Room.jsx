import React, { useEffect, useRef, useState } from "react";

const Room = (props) => {
    const userVideo = useRef();
    const userStream = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const webSocketRef = useRef();

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const openCamera = async () => {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const cameras = allDevices.filter((device) => device.kind === "videoinput");

        if (cameras.length === 0) {
            throw new Error("No camera devices found.");
        }

        const constraints = {
            audio: true,
            video: {
                deviceId: cameras[1] ? cameras[1].deviceId : cameras[0].deviceId,
            },
        };

        try {
            return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err) {
            console.log("Error accessing media devices.", err);
        }
    };

    useEffect(() => {
        openCamera().then((stream) => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            webSocketRef.current = new WebSocket(
                `wss://exclusivestore.xyz/join?roomID=${props.match.params.roomID}`
            );

            webSocketRef.current.addEventListener("open", () => {
                webSocketRef.current.send(JSON.stringify({ join: true }));
            });

            webSocketRef.current.addEventListener("message", async (e) => {
                const message = JSON.parse(e.data);

                if (message.join) {
                    callUser();
                }

                if (message.offer) {
                    handleOffer(message.offer);
                }

                if (message.answer) {
                    console.log("Receiving Answer");
                    peerRef.current.setRemoteDescription(
                        new RTCSessionDescription(message.answer)
                    );
                }

                if (message.iceCandidate) {
                    console.log("Receiving and Adding ICE Candidate");
                    try {
                        await peerRef.current.addIceCandidate(
                            new RTCIceCandidate(message.iceCandidate)
                        );
                    } catch (err) {
                        console.log("Error Receiving ICE Candidate", err);
                    }
                }
            });
        }).catch((err) => {
            console.log("Failed to open camera", err);
        });

        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
            }
            if (peerRef.current) {
                peerRef.current.close();
            }
        };
    }, [props.match.params.roomID]);

    const handleOffer = async (offer) => {
        console.log("Received Offer, Creating Answer");
        peerRef.current = createPeer();

        await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));

        userStream.current.getTracks().forEach((track) => {
            peerRef.current.addTrack(track, userStream.current);
        });

        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);

        webSocketRef.current.send(
            JSON.stringify({ answer: peerRef.current.localDescription })
        );
    };

    const callUser = () => {
        console.log("Calling Other User");
        peerRef.current = createPeer();

        userStream.current.getTracks().forEach((track) => {
            peerRef.current.addTrack(track, userStream.current);
        });
    };

    const createPeer = () => {
        console.log("Creating Peer Connection");
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        peer.onnegotiationneeded = handleNegotiationNeeded;
        peer.onicecandidate = handleIceCandidateEvent;
        peer.ontrack = handleTrackEvent;

        return peer;
    };

    const handleNegotiationNeeded = async () => {
        console.log("Creating Offer");

        try {
            const myOffer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(myOffer);

            webSocketRef.current.send(
                JSON.stringify({ offer: peerRef.current.localDescription })
            );
        } catch (err) {
            console.log("Error during negotiation", err);
        }
    };

    const handleIceCandidateEvent = (e) => {
        console.log("Found Ice Candidate");
        if (e.candidate) {
            webSocketRef.current.send(
                JSON.stringify({ iceCandidate: e.candidate })
            );
        }
    };

    const handleTrackEvent = (e) => {
        console.log("Received Tracks");
        partnerVideo.current.srcObject = e.streams[0];
    };

    const toggleMute = () => {
        userStream.current.getAudioTracks()[0].enabled = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        userStream.current.getVideoTracks()[0].enabled = !isVideoOff;
        setIsVideoOff(!isVideoOff);
    };

    const hangUp = () => {
        if (webSocketRef.current) {
            webSocketRef.current.close();
        }
        if (peerRef.current) {
            peerRef.current.close();
        }
        props.history.push('/');
    };

    return (
        <div className="video-call-container">
            <video className="local-video" autoPlay muted ref={userVideo}></video>
            <video className="remote-video" autoPlay ref={partnerVideo}></video>
            <div className="controls">
                <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
                <button onClick={toggleVideo}>{isVideoOff ? "Turn Video On" : "Turn Video Off"}</button>
                <button onClick={hangUp}>Hang Up</button>
            </div>
        </div>
    );
};

export default Room;
