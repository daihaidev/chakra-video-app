const envConfigs = {
  development: {
    ROOM_BRANDING: 'http://localhost:8000/molb/room_branding',
    AUTH_URL: 'http://localhost:8000/molb/client_auth',
    WEBSOCKET_URL: 'ws://##GATEWAY_ADDRESS##/client_handshake',
    BILLING_SERVICE: 'http://localhost:8080/billing-service/api',
    BILLING_TIMER_DURATION: 1.0
  },
  staging: {
    ROOM_BRANDING: 'https://meetonline.io/molb/room_branding',
    AUTH_URL: 'https://meetonline.io/molb/client_auth',
    WEBSOCKET_URL: 'wss://##GATEWAY_ADDRESS##/client_handshake',
    BILLING_SERVICE: 'https://meetonline.io/billing-service/api',
    BILLING_TIMER_DURATION: 1.0
  },
  production: {
    ROOM_BRANDING: 'https://meetonline.io/molb/room_branding',
    AUTH_URL: 'https://meetonline.io/molb/client_auth',
    WEBSOCKET_URL: 'wss://##GATEWAY_ADDRESS##/client_handshake',
    BILLING_SERVICE: 'https://meetonline.io/billing-service/api',
    BILLING_TIMER_DURATION: 1.0
  }
}

const envConfig = envConfigs[process.env.TARGET_ENV];
console.log("envConfig => ", envConfig);

const commonConfigs = {
  DEFAULT_SPOKEN_LANG: 'en-US',
  MO_COOKIE_NAME: 'meetonline.io.sessionId',
  APP_KEY: '00320027001200200000001500a5001200c60047000000a00000004100770007007200050041003500c500d7002700f6002000b0006000b000720022003700100090002000900067',
}

export default {
  ...commonConfigs,
  ...envConfig
};
