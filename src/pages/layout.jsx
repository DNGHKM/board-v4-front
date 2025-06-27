'use client';

import React, {useEffect} from 'react';
import Header from "@/components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({children}) => {

    useEffect(() => {
        import ('bootstrap/dist/js/bootstrap.bundle.min.js');
    });

    return (
        <div>
            <Header></Header>
            <div>{children}</div>
        </div>
    );
}

export default Layout;