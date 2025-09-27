import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import type { ProtoGrpcType } from '../proto/echo.js';
import { fileURLToPath as nodeFileURLToPath } from 'url';

const __filename = nodeFileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const random = () => {
    const packageDefinition = protoLoader.loadSync(
        path.join(__dirname, '../proto/echo.proto')
    );
    const proto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;

    const echoPackage = new proto.echo.Echo(
        "0.0.0.0:50051",
        grpc.credentials.createInsecure()
    );

    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 5);
    echoPackage.waitForReady(deadline, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        onEchoPackageReady();
    });

    function onEchoPackageReady() {
        echoPackage.echo({ message: "Hello from client" }, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(response?.message);
        });
    }
};
