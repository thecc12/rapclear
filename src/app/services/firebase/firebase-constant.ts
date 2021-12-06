export enum FireBaseConstant {
  AUTH_WRONG_PASSWORD = 'auth/wrong-password', //mauvais password 
  AUTH_EMAIL_ALREADY_USE = 'auth/email-already-in-use', //email déjà utilisé
  AUTH_ACCOUNT_EXIST_WITH_DIFFERENT_CREDENTIAL="auth/account-exists-with-different-credential", //compte existant avec les parametres différents

  AUTH_WEAK_PASSWORD = 'auth/weak-password', //mauvais mot de passe
  AUTH_USER_NOT_FOUND ='auth/user-not-found', //utilisateur non trouvé
  AUTH_CREDENTIAL_ALREADY_IN_USE= "auth/credential-already-in-use", //parametre de connexion déjà utilisé
  
  AUTH_REQUIRE_RECENT_LOGIN = "auth/requires-recent-login",
  AUTH_TOO_MANY_REQUEST="auth/too-many-requests",
  AUTH_NETWORK_FAIL = 'auth/network-request-failed', 
  STORAGE_OBJECT_NOT_FOUND = 'storage/object-not-found',
  DATABASE_DISCONNECTED = -4,
  DATABASE_NETWORK_ERROR = -24,
  DATABASE_OPERATION_FAILED = -2,
  DATABASE_PERMISSION_DENIED = -3,
  DATABASE_SERVICE_UNAVAILABLE = -10,
  DATABASE_UNKNOW_ERROR = -999,
  DESACTIVED_ACCOUNT="auth/user-disabled"
}
