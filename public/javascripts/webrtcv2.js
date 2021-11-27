'use strict';

//@ts-check

/**@type {Map<string, RTCPeerConnection} */
const peerConnectionMap = new Map();

function callMe(){
    socket.emit("callme", {});
    console.log("send callme");
}

/**
 * @param {string} socketId
 * @returns {RTCPeerConnection}
 */
function newPeerConnection(socketId){
    const pc = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    });

    if (stream !== null){
        stream.getTracks().forEach((track)=>{
            pc.addTrack(track, stream);
        });
    }

    peerConnectionMap.set(socketId, pc);

    pc.onicecandidate = (e)=>{
        socket.emit("sendICECandidateEvent", {
            ICECandidate: e.candidate,
            to: socketId
        });
    };

    pc.onsignalingstatechange = (e)=>{
        switch (pc.signalingState) {
            case "stable":
                if (document.getElementById(socketId) === null){
                    const remoteVideo = getVideo(socketId);
                    document.getElementById("remote").appendChild(remoteVideo);
                }
                break;
        }
        console.log("onSignalingStateChange " + socketId + " is " + pc.signalingState);
    }

    pc.onconnectionstatechange = (e)=>{
        switch (pc.connectionState) {
            case "disconnected":
                
            case "closed":
                document.getElementById(socketId).remove();
                peerConnectionMap.delete(socketId);
                break;
        }

        console.log("onConnectionStateChange " + socketId + " is " + e.connectionState);
    };

    pc.onnegotiationneeded = async (e)=>{
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer).catch((e)=> e);
        socket.emit("sendOfferSDPEvent", {
            to: socketId,
            offerSDP: pc.localDescription
        })
    };

    /**
     * @param {RTCTrackEvent} e 
     */
    pc.ontrack = (trackEvent)=>{
        console.log("onTrack " + socketId + " " + trackEvent.track.kind);
        if (trackEvent.track.kind === "audio"){
            return;
        }

        trackEvent.track.onmute = () => {
            console.log("onMute " + socketId);
            const v = getVideo(socketId);
            v.srcObject = null;
        }

        const remoteVideo = getVideo(socketId);
        remoteVideo.srcObject = trackEvent.streams[0];
    }

    return pc;
}

/**
 * @param {{from:string, to:string, offerSDP:RTCSessionDescription}} data
 */
async function receiveCallMe(data){
    console.log("receiveCallMe");
    data.to = data.from;

    const pc = newPeerConnection(data.from);

    const offerSDP = await pc.createOffer();
    await pc.setLocalDescription(offerSDP);
    data.offerSDP = pc.localDescription;
    socket.emit("sendOfferSDPEvent", data);
}

/**
 * @param {{from:string, to:string, offerSDP:RTCSessionDescription, answerSDP:RTCSessionDescription}} data 
 */
async function receiveOfferSDP(data){
    console.log("receiveOfferSDP");
    data.to = data.from;
    /**@type {RTCPeerConnection} */
    let pc;
    if (peerConnectionMap.has(data.from)){
        pc = peerConnectionMap.get(data.from);
    }else{
        pc = newPeerConnection(data.from);
    }

    await pc.setRemoteDescription(data.offerSDP);
    const answerSDP = await pc.createAnswer();
    await pc.setLocalDescription(answerSDP);
    data.answerSDP = answerSDP;
    socket.emit("sendAnswerSDPEvent", data);
}

/**
 * @param {{from:string, answerSDP:RTCSessionDescription}} data 
 */
function receiveAnswerSDP(data) {
    console.log("receiveAnswerSDP");
    const pc = peerConnectionMap.get(data.from);
    pc.setRemoteDescription(data.answerSDP);
}

/**
 * @param {{from:string, ICECandidate:RTCIceCandidate}} data 
 */
function receiveICECandidate(data) {
    console.log("receiveICECandidate");
    const pc = peerConnectionMap.get(data.from);
    pc.addIceCandidate(data.ICECandidate).catch(e=> e);
}

/**@type {MediaStream} */
let stream = null;

async function switchStream(){
    console.log("switch stream");
    if (stream === null){
        stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true}).catch(window.alert);
        peerConnectionMap.forEach((pc)=>{
            stream.getTracks().forEach((track)=>{
                pc.addTrack(track, stream);
            });
        });
        document.getElementById("local").srcObject = stream;
    }else{
        peerConnectionMap.forEach((pc)=>{
            pc.getSenders().forEach((sender)=>{
                if (sender.track === null){
                    return;
                }
                sender.track.enabled = false;
                pc.removeTrack(sender);
            });
        });
        stream.getTracks().forEach((track)=>{
            track.stop();
        });
        document.getElementById("local").srcObject = null;
        stream = null;
    }
}

/**
 * @param {string} socketId 
 * @returns {HTMLVideoElement}
 */
function getVideo(socketId){
    const v = document.getElementById(socketId);
    if (v != null){
        return v;
    }

    const remoteVideo = document.createElement("video");
    remoteVideo.id = socketId;
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    remoteVideo.poster = "/assets/video_slash.png";
    remoteVideo.classList.add("w-100", "mw-100", "mh-100", "bg-dark");
    return remoteVideo;
}

socket.on("callme", receiveCallMe);
socket.on("receiveOfferSDPEvent", receiveOfferSDP);
socket.on("receiveAnswerSDPEvent", receiveAnswerSDP);
socket.on("receiveICECandidateEvent", receiveICECandidate);
window.onload = callMe;