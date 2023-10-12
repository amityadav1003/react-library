export const oktaConfig = {
    clientId: '0oacalfnvmFetVjfM5d7',
    issuer: 'https://dev-50079813.okta.com/oauth2/default',
    redirectUri:'http://localhost:3000/login/callback',
    scopes:['openid' , 'profile','email'],
    pkce: true,
    disableHttpsCheck: true,
}