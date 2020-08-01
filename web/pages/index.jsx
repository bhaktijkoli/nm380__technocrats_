import React from 'react';
import {useSession} from 'next-auth/client';
import Layout from '../layout';

const Home = () => {
    const [session, loading] = useSession();
    return <Layout>{loading ? <h3>Loading</h3> : <h3>Home</h3>}</Layout>;
};

export default Home;
