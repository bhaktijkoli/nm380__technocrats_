import React from 'react';
import {useSession} from 'next-auth/client';

const Navigation = () => {
    const [session, loading] = useSession();
    return <nav className="main-nav"></nav>;
};

export default Navigation;
