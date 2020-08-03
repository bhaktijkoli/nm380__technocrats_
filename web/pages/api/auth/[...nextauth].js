// import NextAuth from 'next-auth';
// import Providers from 'next-auth/providers';
// import Adapter from '../../../database/adapter';
// // import CredentialProvider, {findOneUser} from '../../../database/credentials';
// const passport = require('../../../auth/passport');
// const User = require('../../../models/user');

// const options = {
//     site: process.env.SITE,
//     providers: [
//         Providers.Google({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         }),
//         Providers.Credentials({
//             id: 'credentials',
//             type: 'credentials',
//             name: 'Domain Account',
//             authorize: async (credentials) => {
//                 try {
//                     const user = await User.findOne({
//                         email: credentials.email,
//                     });
//                     if (user.comparePassword(credentials.password)) {
//                         return Promise.resolve(user);
//                     }
//                 } catch (error) {
//                     console.log(error);
//                 }
//             },
//             credentials: {
//                 email: {label: 'Email', type: 'text ', placeholder: 'jsmith'},
//                 password: {label: 'Password', type: 'password'},
//             },
//             scope: 'email',
//             // name: '',
//             // credentials: {
//             //     email: {label: 'Email', type: 'text', placeholder: 'user@email.com'},
//             //     password: {label: 'Password', type: 'password'},
//             // },
//         }),
//     ],
//     sessions: {
//         jwt: true,
//     },
//     database: process.env.DB_URI,
//     debug: true,
//     adapter: Adapter,
// };

// // export default (req, res) => NextAuth(req, res, options);
