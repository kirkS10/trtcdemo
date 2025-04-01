import LibGenerateTestUserSig from './lib-generate-test-usersig-es.min.js';

let SDKAPPID = 20021401;

let SECRETKEY = '86bb6ae8d9dc235241b8c2c9a05af9b7a9ce2a0827536504ca1741701a7cb80d';

/**
 * Expiration time for the signature, it is recommended not to set it too short.
 * Time unit: seconds
 * Default time: 7 x 24 x 60 x 60 = 604800 = 7 days
 */
const EXPIRETIME = 604800;

export function genTestUserSig({ userID, SDKAppID, SecretKey }) {
  if (SDKAppID) SDKAPPID = SDKAppID;
  if (SecretKey) SECRETKEY = SecretKey;
  const generator = new LibGenerateTestUserSig(SDKAPPID, SECRETKEY, EXPIRETIME);
  const userSig = generator.genTestUserSig(userID);

  return {
    SDKAppID: SDKAPPID,
    userSig,
  };
}

export default genTestUserSig;