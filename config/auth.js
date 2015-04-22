/**
 * Manages application authentication for social networks
 * @module auth
 * @author Matthew Elphick
 */
module.exports = {

    'facebookAuth' : {
        'clientID': '406121169549252', // your App ID
        'clientSecret': '828d7928c3f3c4012100ca879f9a1997', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey': 'fSFyZKVw3phGxKHFSp77RE6jD',
        'consumerSecret': 'aIAcedEZNVndbo7ZUiL5YMn9vzXqxQVQQcOA2dQ6JdMUd1pjoq',
        'callbackURL': 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID': '986344973915-u4ccvp9msp07jcg263nund6uk2m2kuf3.apps.googleusercontent.com',
        'clientSecret': 'Q9kMLghK-l_Ef_QCp1DV8Gd-',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    },

    'linkedInAuth' : {
        'clientID': '77vis6h4601jkx',
        'clientSecret': 'PKKEQaIRowc2gllp',
        'callbackURL': 'http://localhost:3000/auth/linkedin/callback'
    }

};