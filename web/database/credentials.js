import Providers from 'next-auth/providers';

export default Providers.Credentials({
    name: 'credentials',
    id: 'credentials',
    type: 'credentials',
    credentials: {
        email: {label: 'Email', type: 'text', placeholder: 'user@email.com'},
        password: {label: 'Password', type: 'password'},
    },
});

async function findOneUser({email, password}) {
    let user;
    try {
        user = await User.findOne({email});
    } catch (error) {
        console.log(error);
    }
}

export {findOneUser};
