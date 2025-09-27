// Original file: proto/echo.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EchoReply as _echo_EchoReply, EchoReply__Output as _echo_EchoReply__Output } from '../echo/EchoReply';
import type { EchoRequest as _echo_EchoRequest, EchoRequest__Output as _echo_EchoRequest__Output } from '../echo/EchoRequest';

export interface EchoClient extends grpc.Client {
  Echo(argument: _echo_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_echo_EchoReply__Output>): grpc.ClientUnaryCall;
  Echo(argument: _echo_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_echo_EchoReply__Output>): grpc.ClientUnaryCall;
  Echo(argument: _echo_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_echo_EchoReply__Output>): grpc.ClientUnaryCall;
  Echo(argument: _echo_EchoRequest, callback: grpc.requestCallback<_echo_EchoReply__Output>): grpc.ClientUnaryCall;
  echo(argument: _echo_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_echo_EchoReply__Output>): grpc.ClientUnaryCall;
  echo(argument: _echo_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_echo_EchoReply__Output>): grpc.ClientUnaryCall;
  echo(argument: _echo_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_echo_EchoReply__Output>): grpc.ClientUnaryCall;
  echo(argument: _echo_EchoRequest, callback: grpc.requestCallback<_echo_EchoReply__Output>): grpc.ClientUnaryCall;
  
}

export interface EchoHandlers extends grpc.UntypedServiceImplementation {
  Echo: grpc.handleUnaryCall<_echo_EchoRequest__Output, _echo_EchoReply>;
  
}

export interface EchoDefinition extends grpc.ServiceDefinition {
  Echo: MethodDefinition<_echo_EchoRequest, _echo_EchoReply, _echo_EchoRequest__Output, _echo_EchoReply__Output>
}
