pub mod echo{
    tonic::include_proto!("echo");
}

use tonic::async_trait;
use echo::echo_server::{Echo, EchoServer};
use echo::{EchoReply, EchoRequest};
struct MyEcho;
    
#[async_trait]
impl Echo for MyEcho {
    // echo not Echo bcoz Tonic converts RPC names to snake_case in Rust.
    async fn echo(
        &self,
        request: tonic::Request<EchoRequest>,
    ) -> Result<tonic::Response<EchoReply>, tonic::Status> {
        println!("{}",request.get_ref().message);
        Ok(
            tonic::Response::new(EchoReply {
            message: format!("Echoing back: {}", request.get_ref().message),
        }))
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let addr = ([0, 0, 0, 0], 50051).into();

    println!("Server listening on {}", addr);
    tonic::transport::Server::builder()
        .add_service(EchoServer::new(MyEcho))
        .serve(addr)
        .await?;

    Ok(())
}