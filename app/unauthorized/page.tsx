'use client';

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function Forbidden403() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rendered, setRendered] = useState('');

    const rawHTML = `
    <p>> <span class="font-bold" style="color: #A020F0;">ERROR CODE</span>: "<i>HTTP 403 Forbidden</i>"</p>
    <p>> <span class="font-bold" style="color: #A020F0;">ERROR DESCRIPTION</span>: "<i>Access Denied. You Do Not Have The Permission To Access This Page On This Server</i>"</p>
    <p>> <span class="font-bold" style="color: #A020F0;">ERROR POSSIBLY CAUSED BY</span>: [<b>execute access forbidden, read access forbidden, write access forbidden, ssl required, ssl 128 required, ip address rejected, client certificate required, site access denied, too many users, invalid configuration, password change, mapper denied access, client certificate revoked, directory listing denied, client access licenses exceeded, client certificate is untrusted or invalid, client certificate has expired or is not yet valid, passport logon failed, source access denied, infinite depth is denied, too many requests from the same client ip</b>...]</p>
    <p>> <span class="font-bold" style="color: #A020F0;">SOME PAGES ON THIS SERVER THAT YOU DO HAVE PERMISSION TO ACCESS</span>: [<a href="/dashboard" class="font-bold" style="color: red;">Home Page</a>, <a href="/timesheet" class="font-bold" style="color: red;">Timesheet</a>, <a class="font-bold" style="color: red;" href="/projects">Projects Us</a>, <a class="font-bold" style="color: red;" href="/leave">Leave</a>, <a class="font-bold" style="color: red;" href="/report">Reports</a>]</p>
    `;

    useEffect(() => {
        let i = 0;
        const typeWriter = () => {
            const interval = setInterval(() => {
                i++;
                setRendered(rawHTML.slice(0, i) + '|');
                if (i >= rawHTML.length) {
                    clearInterval(interval);
                    setRendered(rawHTML);
                }
            }, 10);
        };

        setTimeout(typeWriter, 0);
    }, []);

    return (
        <>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:700&family=Share+Tech+Mono&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <main className="relative min-h-screen flex items-center justify-center bg-white-50 text-gray-800 bg-none">
                {/* Big 403 number in background */}
                <h1
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-bold text-gray-200 drop-shadow-sm z-10 pointer-events-none">
                    403
                </h1>

                {/* Terminal box */}
                <div
                    className="relative z-20  p-2 pt-6 rounded shadow-[0_0_150px_-20px_rgba(0,0,0,0.5)] backdrop-blur-[6px]"
                    ref={containerRef}
                >
                    <div
                        style={{ fontFamily: '"Share Tech Mono", monospace' }}
                        className="leading-relaxed  space-y-4"
                        dangerouslySetInnerHTML={{ __html: rendered }}
                    />
                </div>


            </main>
        </>
    );
}
