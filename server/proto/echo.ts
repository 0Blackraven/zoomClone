import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EchoClient as _echo_EchoClient, EchoDefinition as _echo_EchoDefinition } from './echo/Echo.js';
import type { EchoReply as _echo_EchoReply, EchoReply__Output as _echo_EchoReply__Output } from './echo/EchoReply.js';
import type { EchoRequest as _echo_EchoRequest, EchoRequest__Output as _echo_EchoRequest__Output } from './echo/EchoRequest.js';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  echo: {
    Echo: SubtypeConstructor<typeof grpc.Client, _echo_EchoClient> & { service: _echo_EchoDefinition }
    EchoReply: MessageTypeDefinition<_echo_EchoReply, _echo_EchoReply__Output>
    EchoRequest: MessageTypeDefinition<_echo_EchoRequest, _echo_EchoRequest__Output>
  }
}

