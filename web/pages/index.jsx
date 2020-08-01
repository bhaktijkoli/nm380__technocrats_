import React from 'react';
import {useSession} from 'next-auth/client';
import Layout from '../layout';
import ReactPlayer from 'react-player';

const list = [
    'https://www.youtube-nocookie.com/watch?v=ysz5S6PUM-U',
    'https://www.youtube-nocookie.com/watch?v=T82aYJsDhqA',
    'https://www.youtube-nocookie.com/watch?v=Cx1qHKE_y9Q',
    'https://www.youtube-nocookie.com/watch?v=bcw88YverlE',
    'https://www.youtube-nocookie.com/watch?v=suTYbf-FtXg',
];

const Home = () => {
    const [session, loading] = useSession();
    return (
        <Layout>
            {loading ? (
                <h3>Loading</h3>
            ) : (
                <ul>
                    {list.map((item, k) => (
                        <ReactPlayer controls key={k} url={item} style={{padding: 50}} />
                    ))}
                </ul>
            )}
        </Layout>
    );
};

export default Home;
