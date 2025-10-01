use webrtc::api::{APIBuilder, interceptor_registry::register_default_interceptors};
use webrtc::ice_transport::ice_server::RTCIceServer;
use webrtc::interceptor::registry::Registry;
// use webrtc::track::track_local::rtp_writer::RTPSendError;
use parking_lot::RwLock;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tracing::{error, info};
use webrtc::api::media_engine::MediaEngine;
use webrtc::peer_connection::configuration::RTCConfiguration;
use webrtc::peer_connection::policy::ice_transport_policy::RTCIceTransportPolicy;
use webrtc::peer_connection::sdp::session_description::RTCSessionDescription;
use webrtc::rtp::packet::Packet;
use webrtc::rtp_transceiver::rtp_sender::RTCRtpSender;
use webrtc::track::track_local::TrackLocal;
use uuid::Uuid;
use webrtc::track::track_local::track_local_static_rtp::TrackLocalStaticRTP;
use webrtc::util::Unmarshal;

#[derive(Clone)]
struct Peer {
    id: String,
    // peer_connection : webrtc::peer_connection::RTCPeerConnection,
    room: String,
    // fisrt arc bcz of sharing and all
    // second arc for the sized error
    tracks: Arc<RwLock<Vec<Arc<dyn TrackLocal + Send + Sync>>>>,
}

#[derive(Deserialize)]
struct JoinRequest {
    sdp: String,
    room: String,
    id: String,
}

#[derive(Default)]
pub struct Room {
    peers: HashMap<String, Arc<Peer>>,
}

pub type Rooms = Arc<RwLock<HashMap<String, Arc<RwLock<Room>>>>>;

#[derive(Serialize)]
struct JoinResponse {
    sdp: String,
}

// (JoinResponse, anyhow::Error)
async fn joinHandler(request: JoinRequest, rooms: Rooms) -> () {
    // default only takes care of vp8 for video and maybe opus for audio check and fix for audio
    let mut media_engine = MediaEngine::default();
    media_engine
        .register_default_codecs()
        .expect("media engine");

    let mut registry = Registry::new();
    registry = register_default_interceptors(registry, &mut media_engine).expect("interceptor");

    let api = APIBuilder::new()
        .with_media_engine(media_engine)
        .with_interceptor_registry(registry)
        .build();

    let mut config = RTCConfiguration::default();
    config.ice_servers = vec![RTCIceServer {
        urls: vec![
            "stun:stun.l.google.com:19302".to_owned(),
            "stun:stun1.l.google.com:19302".to_owned(),
            "stun:stun2.l.google.com:19302".to_owned(),
            "stun:stun3.l.google.com:19302".to_owned(),
        ],
        ..Default::default()
    }];
    config.ice_transport_policy = RTCIceTransportPolicy::All;

    let peer_connection = Arc::new(api.new_peer_connection(config).await.expect("create pc"));

    let peer = Arc::new(Peer {
        id: request.id.clone(),
        room: request.room.clone(),
        tracks: Arc::new(RwLock::new(Vec::new())),
    });

    let room_lock = {
        let mut room_write = rooms.write();
        room_write
            .entry(request.room.clone())
            .or_insert_with(|| Arc::new(RwLock::new(Room::default())))
            .clone()
    };

    {
        let mut room = room_lock.write();
        room.peers.insert(request.id.clone(), peer.clone());
    }

    peer_connection
        .on_track(Box::new(move |track_remote, _reciever| {
            let track_remote = track_remote.clone();
            let room_clone = (room_lock.clone()).clone();
            let publisher = (peer.id.clone()).clone();

            Box::pin(async move {
                info!("on_track: got track for publisher{}", publisher);
                let mut buf = vec![0u8; 1600];
                loop {
                    match track_remote.read(&mut buf).await {
                        Ok((n, _)) => {
                            if let Ok(pkt) = Packet::unmarshal(&mut buf[..n]) {
                                let room = room_clone.read();
                                for (peer_id, peer_arc) in room.peers.iter() {
                                    if peer_id == &publisher {
                                        continue;
                                    }
                                    let tracks = peer_arc.tracks.read().clone();
                                    for t in tracks.iter() {
                                        if let Err(err) = t.write_rtp(&pkt).await {
                                            error!("write_rtp error to {}: {:?}", peer_id, err);
                                        }
                                    }
                                }
                            }
                        }
                        Err(e) => {
                            error!("track read error: {:?}", e);
                            break;
                        }
                    }
                }
                info!("on_track loop ended for publisher {}", publisher);
            })
        }))
        .await;
    {
        let track = Arc::new(TrackLocalStaticRTP::new(
            webrtc::rtp_transceiver::rtp_codec::RTCRtpCodecCapability {
                mime_type: "video/VP8".to_owned(),
                ..Default::default()
            },
            format!("video-{}", Uuid::new_v4()),
            "minimal-sfu".to_owned(),
        ));

        {
            peer.tracks.write().push(track.clone());
        }

        if let Err(e) = peer_connection.add_transceiver_from_track(track.clone(), None).await {
            error!("add_transceiver_from_track error: {:?}", e);
        }
    }

    let offer = RTCSessionDescription::offer(request.sdp).expect("offer");
    if let Err(e) = peer_connection.set_remote_description(offer).await {
        error!("set_remote_description err: {:?}", e);
    }
    let answer = peer_connection.create_answer(None).await.expect("create answer");
    peer_connection.set_local_description(answer.clone())
        .await
        .expect("set local desc");

    let sdp = answer.sdp;
}
